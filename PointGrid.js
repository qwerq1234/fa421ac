_vertex0 = `
uniform float time;
uniform vec3 lPos;

varying vec3 pos;

void main() {
    vec3 _pos = position;
    pos = position.xyz;

    
    float r = length(pos.xz-lPos.xz);

    float wave = (sin(time+_pos.x)/2.0) + (sin(time+_pos.z)/2.0);
    
   
    _pos.y = 1.0 - wave;
    if(r<2.0) {
        float o = 1.0 - smoothstep(0.0, 2.0, r);
        //o *= abs(5.0*sin(3.14/2.0));
        _pos.y += o;
    }

    vec4 mvPos = modelViewMatrix * vec4(_pos, 1.0);

    gl_PointSize = 2.0;
    gl_Position = projectionMatrix * mvPos;
}
`;

_fragment0 = `
uniform float time;
uniform vec3 lPos;
uniform sampler2D texture;

varying vec3 pos;

void main() {
    vec3 col = vec3(0.0);

    vec2 sCenter = pos.xz - lPos.xz;
    col.b=1.0;

    float s = length(sCenter);
    if(s < 2.0) {
        col.r= (smoothstep(2.0,0.0,s/1.33));
        col.b = gl_PointCoord.y;
    }

    col.g = gl_PointCoord.x;

    gl_FragColor = vec4(col, 1.0);
}
`;

class PointGrid extends THREE.Points {

    constructor(position) {
        super(undefined, undefined);
        this.geometry = this.getGeometry(0.25, 0.25, 32, 32);
        this.material = this.getMaterial();
    }

    getMaterial() {
        return new T3.ShaderMaterial( {
            uniforms : {
                time : {value : 0.0 },
                lPos : {value: new T3.Vector3(0,0,0)}, 
            },
            blending : THREE.AdditiveBlending,
            depthTest : true,
            transparent: true,
            vertexShader : _vertex0, 
            fragmentShader : _fragment0
        });
    }

    getGeometry(xOff, yOff, xLen, yLen) {
        let pG = new T3.Geometry();

        for(var x=-xLen;x<xLen;++x) {
            for(var y=-yLen;y<yLen;++y) {  
                pG.vertices.push(new T3.Vector3(x * xOff, 1, y*yOff));
            }
        }

        return pG;
    }


    updateUniforms(t, lPos) {
        this.material.uniforms.time.value = t;
        this.material.uniforms.lPos.value = lPos;
    }
};


