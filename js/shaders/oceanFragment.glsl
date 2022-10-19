precision mediump float;

uniform sampler2D iChannel0;
uniform vec3 iResolution;     
uniform float iTime;


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	// Get the UV Coordinate of your texture or Screen Texture, yo!
	vec2 uv = fragCoord.xy / iResolution.xy;
	
	// Flip that shit, cause shadertool be all "yolo opengl"
	uv.y = -1.0 - uv.y;
	
	// Modify that X coordinate by the sin of y to oscillate back and forth up in this.
	uv.x += sin(uv.y*10.0+iTime)/10.0;
	
	
	// Get the pixel color at the index.
	vec4 color = texture(iChannel0, uv);
	
	fragColor = color;
}

void main() {
    // gl_FragColor = texture2D(iChannel0, uv);
    mainImage(gl_FragColor, gl_FragCoord.xy);

}