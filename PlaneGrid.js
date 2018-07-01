
_vertex1 = `
uniform float time;
uniform vec3 lPos;
uniform sampler2D stex;

varying vec3 _pos;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
    vec3 pos = position;
    _pos = position;

    vec2 uv = vec2(_pos.x/16.0, _pos.z/16.0);

    vec3 pp = vec3(0.0, 0.0, 0.0);

    //float r = length(pos.xz-lPos.xz);


    float _b = texture2D(stex, vec2(0.25, 0.0)).x;
    //pos.y += _b * (uv.x*uv.x) * 4.0;
    
    //float _v = texture2D(stex, vec2(0.3, 0.0)).x; 
    //pos.y += _v * (pow(uv.x+0.1,2.0)) * 4.0;

   /* 
    for(float x=-1.0;x<=1.0;x+=1.0) { 
        for(float y=-1.0;y<=1.0;y+=1.0) {
            
            float l = length(pos.xz - vec2(x * 4.5, y * 4.5) );
            float r = 4.0 ;
            float h = 1.0*sin(time);        

            if(l<r) {
                float o = 1.0 - smoothstep(0.0, r, l);
                pos.y += h*o;
            }
        }
    }
    */ 

    float a0 = min(length(pos.xz-vec2(-5.0, -5.0)), 
                   length(pos.xz-vec2( 5.0, 2.5))
                   );
    float l0 = min(length(pos.xz-vec2(0.0, 5.0)), a0);

    float r = 4.0;
    float h = 1.0 * sin(time);
    if(l0<r) {
        float o = 1.0 - smoothstep(0.0, r, l0);
        pos.y += h * o;
    }

    vec4 c = texture2D(stex,vec2(abs(uv.x),0.0));
    pos.y += 2.33*(c.x * 0.25 + (c.y * 0.30) + (c.z*0.25));
    pos.y += (sin(time + uv.x * 8.00) + cos(time+uv.y*8.0)) /2.0;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
}
`;

_fragment1 = `

varying vec3 _pos;
uniform sampler2D stex;
uniform float time;

void main() {
    vec3 col = vec3(0.0);
    vec2 uv = vec2(_pos.xz)/64.0;
    vec4 c = texture2D(stex, vec2(abs(uv.x), 0.0));

    float q = abs(80.0*uv.x*(sin(time))) * 0.5;
    float w = abs(20.0*uv.y*(sin(time))) * 0.5;
    
    col.r = abs(sin(q+w));
    col.b = abs(sin(q));
    col.g = abs(sin(w));

    col.b = max(col.b, pow(c.x, 2.0));
    col.r = max(col.r, pow(c.y, 4.0));
    col.g = max(col.g, pow(c.z, 2.0));

    gl_FragColor = vec4(col, 1.0);
}
`;

class PlaneGrid extends THREE.Mesh {

    constructor() {
        super(undefined, undefined);
        this.geometry = this.getGeometry();
        this.material = this.getMaterial();
    }

    getGeometry() {
        return (new T3.PlaneGeometry(16, 16, 32, 32)).rotateX(Math.PI/2.0);
    }

    getMaterial() {
        return new T3.ShaderMaterial( {
            uniforms : {
                time : {value : 0.0 },
                lPos : {value : new T3.Vector3(0,0,0)}, 
                stex : {value : new T3.Texture()}
            },
            side : T3.DoubleSide, 
            blending : THREE.AdditiveBlending,
            depthTest : true,
            wireframe : true, 
            //transparent: true,
            vertexShader : _vertex1, 
            fragmentShader : _fragment1
        });
    }

    updateUniforms(t, lPos) {
        this.material.uniforms.time.value = t;
        this.material.uniforms.lPos.value = lPos;
    }

    updateSound(_snd) {
        this.material.uniforms.stex.value = _snd;
    }
};

