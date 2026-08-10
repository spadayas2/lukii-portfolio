(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();class P{constructor(){this.ctx=null,this.analyser=null,this.data=null,this.freq=null,this.master=null,this.source=null,this.bufferSource=null,this.proceduralNodes=[],this.usingTrack=!1,this.started=!1,this.beat=0,this.energy=0,this._prevBass=0,this._beatEnv=0}async start(){this.ctx||(this.ctx=new AudioContext,this.analyser=this.ctx.createAnalyser(),this.analyser.fftSize=2048,this.analyser.smoothingTimeConstant=.78,this.data=new Uint8Array(this.analyser.fftSize),this.freq=new Uint8Array(this.analyser.frequencyBinCount),this.master=this.ctx.createGain(),this.master.gain.value=.55,this.master.connect(this.ctx.destination),this.analyser.connect(this.master)),this.ctx.state==="suspended"&&await this.ctx.resume(),this.usingTrack||this._startProcedural(),this.started=!0}async loadFile(e){await this.start();const t=await e.arrayBuffer(),s=await this.ctx.decodeAudioData(t);this._stopSources(),this.usingTrack=!0;const a=this.ctx.createBufferSource();a.buffer=s,a.loop=!0,a.connect(this.analyser),a.start(),this.bufferSource=a}_stopSources(){var e,t;for(const s of this.proceduralNodes)try{(e=s.stop)==null||e.call(s),(t=s.disconnect)==null||t.call(s)}catch{}if(this.proceduralNodes=[],this.bufferSource){try{this.bufferSource.stop(),this.bufferSource.disconnect()}catch{}this.bufferSource=null}}_startProcedural(){this._stopSources(),this.usingTrack=!1;const e=this.ctx,s=60/112,a=e.createGain();a.gain.value=1,a.connect(this.analyser);const r=e.createGain();r.gain.value=1,r.connect(this.analyser);const i=e.createOscillator();i.type="sawtooth",i.frequency.value=55;const o=e.createBiquadFilter();o.type="lowpass",o.frequency.value=420;const l=e.createGain();l.gain.value=.045,i.connect(o),o.connect(l),l.connect(this.analyser),i.start();const h=e.createOscillator();h.frequency.value=.08;const v=e.createGain();v.gain.value=180,h.connect(v),v.connect(o.frequency),h.start(),this.proceduralNodes.push(i,h,a,r);const w=()=>{if(this.usingTrack||!this.started)return;const R=e.currentTime,q=Math.ceil(R/s)*s;for(let f=0;f<8;f++){const y=q+f*s;this._scheduleKick(a,y),f%2===1&&this._scheduleHat(r,y),f%4===0&&this._scheduleBass(y)}this._schedulerId=window.setTimeout(w,s*4*1e3*.9)};w()}_scheduleKick(e,t){const s=this.ctx.createOscillator();s.type="sine",s.frequency.setValueAtTime(140,t),s.frequency.exponentialRampToValueAtTime(42,t+.18);const a=this.ctx.createGain();a.gain.setValueAtTime(1e-4,t),a.gain.exponentialRampToValueAtTime(.9,t+.01),a.gain.exponentialRampToValueAtTime(1e-4,t+.28),s.connect(a),a.connect(e),s.start(t),s.stop(t+.32)}_scheduleHat(e,t){const s=this.ctx.sampleRate*.05,a=this.ctx.createBuffer(1,s,this.ctx.sampleRate),r=a.getChannelData(0);for(let h=0;h<s;h++)r[h]=Math.random()*2-1;const i=this.ctx.createBufferSource();i.buffer=a;const o=this.ctx.createBiquadFilter();o.type="highpass",o.frequency.value=7e3;const l=this.ctx.createGain();l.gain.setValueAtTime(1e-4,t),l.gain.exponentialRampToValueAtTime(.18,t+.005),l.gain.exponentialRampToValueAtTime(1e-4,t+.045),i.connect(o),o.connect(l),l.connect(e),i.start(t),i.stop(t+.06)}_scheduleBass(e){const t=this.ctx.createOscillator();t.type="triangle";const s=[55,65.41,73.42,82.41];t.frequency.value=s[Math.floor(Math.random()*s.length)];const a=this.ctx.createGain();a.gain.setValueAtTime(1e-4,e),a.gain.exponentialRampToValueAtTime(.12,e+.02),a.gain.exponentialRampToValueAtTime(1e-4,e+.45),t.connect(a),a.connect(this.analyser),t.start(e),t.stop(e+.5)}pulseBurst(){if(!this.ctx||!this.started)return;const e=this.ctx.currentTime,t=this.ctx.createOscillator();t.type="sine",t.frequency.setValueAtTime(220,e),t.frequency.exponentialRampToValueAtTime(60,e+.35);const s=this.ctx.createGain();s.gain.setValueAtTime(1e-4,e),s.gain.exponentialRampToValueAtTime(.35,e+.01),s.gain.exponentialRampToValueAtTime(1e-4,e+.4),t.connect(s),s.connect(this.analyser),t.start(e),t.stop(e+.45)}update(){if(!this.analyser)return this.beat=0,this.energy=0,{beat:0,energy:0};this.analyser.getByteFrequencyData(this.freq),this.analyser.getByteTimeDomainData(this.data);let e=0;const t=Math.min(24,this.freq.length);for(let i=0;i<t;i++)e+=this.freq[i];e/=t*255;let s=0;for(let i=24;i<90&&i<this.freq.length;i++)s+=this.freq[i];s/=16830;let a=0;for(let i=0;i<this.data.length;i++){const o=(this.data[i]-128)/128;a+=o*o}a=Math.sqrt(a/this.data.length);const r=Math.max(0,e-this._prevBass-.04);return this._prevBass=e*.9+this._prevBass*.1,this._beatEnv=this._beatEnv*.92+(r*5.5+e*.45)*.08,this.beat=Math.min(1,this._beatEnv*1.15),this.energy=Math.min(1,s*1.4+a*1.8),{beat:this.beat,energy:this.energy}}}const z=`#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`,I=`#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_offset;
uniform float u_travel;
uniform float u_beat;
uniform float u_pulse;
uniform float u_speed;

// Fixed Julia seed — beat never reshapes the fractal
const vec2 JULIA_C = vec2(-0.8, 0.156);

float julia(vec2 z) {
  float iter = 0.0;
  const float MAX_I = 64.0;
  for (float i = 0.0; i < MAX_I; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + JULIA_C;
    if (dot(z, z) > 12.0) {
      // smooth iteration count
      return i - log2(log2(dot(z, z))) + 4.0;
    }
    iter = i;
  }
  return MAX_I;
}

vec3 wallColor(float t) {
  // Metallic trench panels with warm edge lights
  vec3 shadow = vec3(0.03, 0.05, 0.09);
  vec3 steel = vec3(0.18, 0.32, 0.48);
  vec3 lit = vec3(0.55, 0.78, 0.95);
  vec3 ember = vec3(1.0, 0.55, 0.2);
  vec3 col = mix(shadow, steel, smoothstep(0.0, 0.45, t));
  col = mix(col, lit, smoothstep(0.45, 0.85, t));
  col = mix(col, ember, smoothstep(0.75, 1.0, fract(t * 3.0)) * 0.4);
  return col;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

  // Steer inside the trench before projecting
  uv -= u_offset * 0.85;

  // Beat / space pulse only: walls breathe, lights surge
  float pulse = u_beat * 0.55 + u_pulse * 0.9;
  float breathe = 1.0 + pulse * 0.08;

  // Death-star trench projection: 1/r tunnel
  float r = length(uv) * breathe + 1e-4;
  float a = atan(uv.y, uv.x);
  float depth = (0.55 / r) + u_travel;

  // Map tunnel surface into Julia space (stable structure)
  vec2 fp = vec2(cos(a * 2.0), sin(a * 2.0));
  fp *= 0.85 + 0.25 * sin(depth * 0.35);
  fp.x += sin(depth * 0.55) * 0.08;
  fp.y += cos(depth * 0.4) * 0.08;

  float esc = julia(fp);
  float t = clamp(esc / 64.0, 0.0, 1.0);
  vec3 col = wallColor(t);

  // Longitudinal trench ribbing / panel lines
  float ribs = abs(sin(depth * 5.5));
  float panels = smoothstep(0.15, 0.0, abs(fract(a / 6.28318 * 8.0) - 0.5));
  col *= 0.72 + ribs * 0.28;
  col += vec3(0.15, 0.35, 0.55) * panels * (0.15 + pulse * 0.25);

  // Running lights racing past (speed feel)
  float runners = pow(abs(sin(depth * 3.0 - u_time * u_speed * 1.8)), 40.0);
  col += vec3(0.35, 0.8, 1.0) * runners * (0.35 + pulse * 0.65);
  col += vec3(1.0, 0.45, 0.15) * runners * pulse * 0.25;

  // Bright vanishing-point core down the trench
  float core = exp(-r * 3.2);
  col += vec3(0.2, 0.45, 0.7) * core * (0.25 + pulse * 0.35);

  // Depth shading — closer walls brighter
  float near = smoothstep(0.05, 0.9, r);
  col *= 0.35 + near * 0.9;

  // Soft cockpit vignette
  float vig = smoothstep(1.4, 0.25, length(uv * vec2(1.2, 1.0)));
  col *= vig;

  // Gentle pulse glow — no color-mode thrashing
  col *= 1.0 + pulse * 0.18;

  col = col / (1.0 + col * 0.55);
  col = pow(max(col, 0.0), vec3(0.95));

  outColor = vec4(col, 1.0);
}
`;function A(n,e,t){const s=n.createShader(e);if(n.shaderSource(s,t),n.compileShader(s),!n.getShaderParameter(s,n.COMPILE_STATUS)){const a=n.getShaderInfoLog(s);throw n.deleteShader(s),new Error(a||"Shader compile failed")}return s}function F(n,e,t){const s=n.createProgram(),a=A(n,n.VERTEX_SHADER,e),r=A(n,n.FRAGMENT_SHADER,t);if(n.attachShader(s,a),n.attachShader(s,r),n.linkProgram(s),!n.getProgramParameter(s,n.LINK_STATUS))throw new Error(n.getProgramInfoLog(s)||"Program link failed");return s}class C{constructor(e){if(this.canvas=e,this.gl=e.getContext("webgl2",{antialias:!1,powerPreference:"high-performance"}),!this.gl)throw new Error("WebGL2 is required for Fractal Pulse");const t=this.gl;this.program=F(t,z,I),this.uniforms={resolution:t.getUniformLocation(this.program,"u_resolution"),time:t.getUniformLocation(this.program,"u_time"),offset:t.getUniformLocation(this.program,"u_offset"),travel:t.getUniformLocation(this.program,"u_travel"),beat:t.getUniformLocation(this.program,"u_beat"),pulse:t.getUniformLocation(this.program,"u_pulse"),speed:t.getUniformLocation(this.program,"u_speed")};const s=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,s),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW);const a=t.getAttribLocation(this.program,"a_position");t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.state={offset:{x:0,y:0},travel:0,beat:0,pulse:0,speed:1}}resize(){const e=Math.min(window.devicePixelRatio||1,2),t=Math.floor(this.canvas.clientWidth*e),s=Math.floor(this.canvas.clientHeight*e);(this.canvas.width!==t||this.canvas.height!==s)&&(this.canvas.width=t,this.canvas.height=s,this.gl.viewport(0,0,t,s))}render(e){this.resize();const t=this.gl,s=this.state;t.useProgram(this.program),t.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),t.uniform1f(this.uniforms.time,e),t.uniform2f(this.uniforms.offset,s.offset.x,s.offset.y),t.uniform1f(this.uniforms.travel,s.travel),t.uniform1f(this.uniforms.beat,s.beat),t.uniform1f(this.uniforms.pulse,s.pulse),t.uniform1f(this.uniforms.speed,s.speed),t.drawArrays(t.TRIANGLES,0,6)}}class D{constructor(e){this.canvas=e,this.pointer={x:0,y:0,nx:0,ny:0},this.steer={x:0,y:0},this.zoomDelta=0,this.spacePressed=!1,this._spaceLatch=!1,this.pulseRequest=!1,window.addEventListener("pointermove",t=>this._onPointer(t)),window.addEventListener("pointerdown",t=>this._onPointer(t)),window.addEventListener("wheel",t=>{t.preventDefault(),this.zoomDelta+=-Math.sign(t.deltaY)*.08},{passive:!1}),window.addEventListener("keydown",t=>{t.code==="Space"&&(t.preventDefault(),this._spaceLatch||(this.pulseRequest=!0,this._spaceLatch=!0),this.spacePressed=!0)}),window.addEventListener("keyup",t=>{t.code==="Space"&&(this.spacePressed=!1,this._spaceLatch=!1)})}_onPointer(e){const t=this.canvas.getBoundingClientRect();this.pointer.x=e.clientX,this.pointer.y=e.clientY,this.pointer.nx=(e.clientX-t.left)/t.width*2-1,this.pointer.ny=-((e.clientY-t.top)/t.height*2-1),this.steer.x=this.pointer.nx,this.steer.y=this.pointer.ny}consumePulse(){const e=this.pulseRequest;return this.pulseRequest=!1,e}consumeZoom(){const e=this.zoomDelta;return this.zoomDelta=0,e}}const L=document.getElementById("gl"),T=document.getElementById("hud"),V=document.getElementById("start-btn"),S=document.getElementById("audio-file"),G=document.getElementById("beat-bar"),U=document.getElementById("energy-bar"),c=new C(L),g=new P,p=new D(L);let _=!1,d=0,u=2.4,m=0,B=performance.now();async function M(n){await g.start(),n&&await g.loadFile(n),T.classList.add("playing"),T.querySelector(".meters").hidden=!1,_=!0}V.addEventListener("click",()=>{M().catch(n=>{console.error(n),alert("Could not start audio. Try again after interacting with the page.")})});S.addEventListener("change",()=>{var e;const n=(e=S.files)==null?void 0:e[0];n&&M(n).catch(t=>{console.error(t),alert("Could not load that track.")})});function x(n,e,t){return Math.max(e,Math.min(t,n))}function b(n,e,t){return n+(e-n)*t}function O(n,e){const{beat:t,energy:s}=g.update();c.state.beat=t,G.style.width=`${Math.round(t*100)}%`,U.style.width=`${Math.round(s*100)}%`,p.consumePulse()&&(d=1,m=1,g.pulseBurst()),d=Math.max(0,d-n*1.8),m=Math.max(0,m-n*1.1),c.state.pulse=d;const a=_?2.6:.55,r=p.consumeZoom()*4.5;u=b(u,a+m*5.5+s*.8+r,1-Math.exp(-n*4)),p.spacePressed&&(u+=n*3.5),u=x(u,.4,12),c.state.speed=u,c.state.travel+=u*n;const i=x(p.steer.x*.42,-.48,.48),o=x(p.steer.y*.28,-.32,.32);c.state.offset.x=b(c.state.offset.x,i,1-Math.exp(-n*5)),c.state.offset.y=b(c.state.offset.y,o,1-Math.exp(-n*5)),_||(c.state.beat=.12+.08*Math.sin(e*2),c.state.offset.x=Math.sin(e*.35)*.12,c.state.offset.y=Math.cos(e*.28)*.06)}function E(n){const e=Math.min(.05,(n-B)/1e3);B=n;const t=n/1e3;O(e,t),c.render(t),requestAnimationFrame(E)}requestAnimationFrame(E);
