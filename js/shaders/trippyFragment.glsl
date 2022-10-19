precision mediump float;

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform vec3 iResolution;     
uniform float iTime;
uniform vec4 iMouse; 

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    float x=uv.s, y=uv.t, time=iTime;
    
    
    vec2 cen = 2.0*vec2(0.080,0.519);
    x -= cen.x;
    y -= cen.y;
    float zoom = 32.248 + 154.0 * (0.5 + 0.5 * sin(time * 0.2));
    x += cen.x/2.0;
    y += cen.y/2.0;
    x /= zoom;
    y /= zoom;
    x *= (iResolution.x / iResolution.y - 1.0) / 2.0 + 1.0;
    x -= cen.x;
    y -= cen.y;
    vec3 color0 = vec3(0.);
    vec3 color1 = vec3(0.);
    
    vec2 z = vec2(x, y);
    int j=49;
    for (int i=0; i<50; i++) {
        vec2 z2;
        z2.x = z.x*z.x - z.y*z.y;
        z2.y = z.x*z.y * 2.0;
        z = z2;
        z += vec2(x, y);
        x += 0.001 * sin(time*0.2 + x * 0.1);
        //y += 0.001 * cos(time);
        vec2 z3 = z;
        z3.x += 2.0 + 4.0*sin(time);
        z3.y += 1.0 + 3.0*sin(time*1.2+0.4);
        if (length(z) > 2.0) {
            color0.r = cos(atan(z3.y, z3.x) * 0.672);
            color0.g = cos((length(z3) - 2.0) * -0.156 + atan(z3.y, z3.x) * 1.0);
            color0.b = 0.252 * cos((length(z3) - 2.120) * 0.864);
            j=i;
            break;
        }
        color1.r = cos(atan(z.y, z.x) * 1000.672 * y);
        color1.b = cos(atan(z.y, z.x) * 1000.672 * y + 1.3);
        color1.g += 0.444 * cos((length(z) - 20.104) * 1.872);
    }
    
    vec3 color = mix(color0, color1, pow(float(j) / 49.0, 10.0));

    

    fragColor = vec4(color,1.0);
}

void main() {
    // gl_FragColor = texture2D(iChannel0, uv);
    mainImage(gl_FragColor, gl_FragCoord.xy);

}