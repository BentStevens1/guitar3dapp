    precision mediump float;

    uniform sampler2D iChannel0;
    uniform vec3 iResolution;     
    uniform float iTime;

    varying vec2 vUv;

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 texel = 1. / iResolution.xy;
        vec2 uv = fragCoord.xy / iResolution.xy;
        uv.y = 1. - vUv.y;

        vec2 warp = texture2D( iChannel0, uv*0.1 + iTime*vec2(0.04,0.03) ).xz;
        vec3 components = texture2D(iChannel0, uv).xyz;
        vec3 norm = normalize(components);
        //fragColor = vec4(0.5 + norm.z);
        
        // below line originally by jdrage with yet another tweak by cornusammonis. (see: https://twitter.com/paniq/status/836899595804413952)
        vec4 m= vec4(norm.zzz,1);

        vec2 st = vUv + warp*.5;        
        fragColor = vec4( texture2D( iChannel0, st ).xyz, 1.0 );

      }
    
    void main() {
      // gl_FragColor = texture2D(iChannel0, uv);
      mainImage(gl_FragColor, gl_FragCoord.xy);

    }
    