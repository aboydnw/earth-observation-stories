import{h as oe,r as k,j as A}from"./index-J8g9Uaa6.js";import{p as U}from"./index-DNSM19cI.js";import{u as ae}from"./MapChapter-DdgYZZr8.js";import{C as se,a as ee,A as ie,b as ce,R as Z,e as J,p as te,m as le,c as ue}from"./colormap-ByhABG_Q.js";import{d as fe,G as X,S as K,P as _,a as de,b as pe}from"./cogPipeline-DD3aykKa.js";import{D as me}from"./DeckOverlay-CYtrro9f.js";import"./geojson-layer-CfZhsCvn.js";import"./mapbox-overlay-BZD5R_aV.js";function he(e,t){const r=e.length/3,n=new Uint8ClampedArray(r*4),o=0,a=r,i=r*2;for(let s=0;s<r;s++)n[4*s+0]=e[o+s]>>8,n[4*s+1]=e[a+s]>>8,n[4*s+2]=e[i+s]>>8,n[4*s+3]=255;return new ImageData(n,r,1)}class ge{worker;jobIdCounter=0;jobs=new Map;constructor(t){this.worker=t,this.worker.addEventListener("message",r=>this.onMessage(r))}get jobCount(){return this.jobs.size}onMessage(t){const{jobId:r,error:n,pixels:o}=t.data,a=this.jobs.get(r);this.jobs.delete(r),a&&(n?a.reject(new Error(n)):a.resolve(o))}submitJob(t,r){const n=this.jobIdCounter++;return new Promise((o,a)=>{this.jobs.set(n,{resolve:o,reject:a}),this.worker.postMessage({...t,jobId:n},{transfer:r})})}terminate(){this.worker.terminate()}}const we=typeof navigator<"u"?navigator.hardwareConcurrency??2:2;class ye{workerWrappers;constructor(t={}){const{size:r=we,createWorker:n}=t;if(this.workerWrappers=[],n&&r>0)for(let o=0;o<r;o++)this.workerWrappers.push(new ge(n()))}get hasWorkers(){return this.workerWrappers.length>0}async decode(t,r,n){if(!this.hasWorkers)return fe(t,r,n);const o=this.leastLoaded(),a={compression:r,metadata:n,buffer:t};return await o.submitJob(a,[t])}destroy(){for(const t of this.workerWrappers)t.terminate();this.workerWrappers.length=0}leastLoaded(){let t=this.workerWrappers[0];for(let r=1;r<this.workerWrappers.length;r++)this.workerWrappers[r].jobCount<t.jobCount&&(t=this.workerWrappers[r]);return t}}let z=null;function be(){return z!==null||(z=new ye({createWorker:()=>new Worker(new URL(""+new URL("worker-CCFqXl4w.js",import.meta.url).href,import.meta.url),{type:"module"})})),z}function ve(e){const{height:t,width:r}=e;if(e.layout==="band-separate")throw new Error("Band-separate images not yet implemented.");if(e.data.length===t*r*4)return e;if(e.data.length===t*r*3){const n=e.data.length/3*4,o=e.data instanceof Uint16Array,a=o?new Uint16Array(n):new Uint8ClampedArray(n),i=o?65535:255;for(let s=0;s<e.data.length/3;++s)a[s*4]=e.data[s*3],a[s*4+1]=e.data[s*3+1],a[s*4+2]=e.data[s*3+2],a[s*4+3]=i;return{...e,count:4,data:a}}else throw new Error(`Unexpected number of channels in raster data: ${e.data.length/(t*r)}`)}async function Te(e){return typeof e=="string"||e instanceof URL?await X.fromUrl(e):e instanceof ArrayBuffer?await X.fromArrayBuffer(e):e}function xe(e,t){const[r,n,o,a]=e.bbox,i=[t.forward([r,n]),t.forward([o,n]),t.forward([o,a]),t.forward([r,a])],s=i.map(l=>l[0]),u=i.map(l=>l[1]),p=Math.min(...s),g=Math.min(...u),m=Math.max(...s),b=Math.max(...u);return{west:p,south:g,east:m,north:b}}const ke=`
  vec3 black_zero_to_rgb(float value) {
    return vec3(value, value, value);
  }
`,Re={name:"black-is-zero",inject:{"fs:#decl":ke,"fs:DECKGL_FILTER_COLOR":`
      color.rgb = black_zero_to_rgb(color.r);
    `}},Ee=`
  const vec3 D65 = vec3(
      0.95047, // Xn
      1.00000, // Yn
      1.08883 // Zn
  );

  vec3 cielabToRgb(vec3 labTex) {
    // labTex in [0,1] from RGB8 texture
    float L = labTex.r * 255.0;
    float a = (labTex.g - 0.5) * 255.0;
    float b = (labTex.b - 0.5) * 255.0;

    float y = (L + 16.0) / 116.0;
    float x = (a / 500.0) + y;
    float z = y - (b / 200.0);

    vec3 xyz;
    vec3 v = vec3(x, y, z);
    vec3 v3 = v * v * v;

    xyz = D65 * mix(
      (v - 16.0 / 116.0) / 7.787,
      v3,
      step(0.008856, v3)
    );

    vec3 rgb = mat3(
      3.2406, -1.5372, -0.4986,
      -0.9689, 1.8758, 0.0415,
      0.0557, -0.2040, 1.0570
    ) * xyz;

    // sRGB gamma
    rgb = mix(
      12.92 * rgb,
      1.055 * pow(rgb, vec3(1.0 / 2.4)) - 0.055,
      step(0.0031308, rgb)
    );

    return clamp(rgb, 0.0, 1.0);
  }
`,Fe={name:"cielab-to-rgb",inject:{"fs:#decl":Ee,"fs:DECKGL_FILTER_COLOR":`
      color.rgb = cielabToRgb(color);
    `}},je=`
  vec3 cmykToRgb(vec4 cmyk) {
    // cmyk in [0.0, 1.0]
    float invK = 1.0 - cmyk.a;

    return vec3(
        (1.0 - cmyk.r) * invK,
        (1.0 - cmyk.g) * invK,
        (1.0 - cmyk.b) * invK
    );
  }
`,Le={name:"cmyk-to-rgb",inject:{"fs:#decl":je,"fs:DECKGL_FILTER_COLOR":`
      color.rgb = cmykToRgb(color);
    `}},Ce=`
  vec3 white_zero_to_rgb(float value) {
    return vec3(1.0 - value, 1.0 - value, 1.0 - value);
  }
`,Se={name:"white-is-zero",inject:{"fs:#decl":Ce,"fs:DECKGL_FILTER_COLOR":`
      color.rgb = white_zero_to_rgb(color.r);
    `}},q="nodata",Me=`uniform ${q}Uniforms {
  float value;
} ${q};
`,$e={name:q,fs:Me,inject:{"fs:DECKGL_FILTER_COLOR":`
    if (color.r == nodata.value) {
      discard;
    }
    `},uniformTypes:{value:"f32"},getUniforms:e=>({value:e.value})},_e={name:"mask-texture",inject:{"fs:#decl":"uniform sampler2D maskTexture;","fs:DECKGL_FILTER_COLOR":`
      float maskValue = texture(maskTexture, geometry.uv).r;
      if (maskValue == 0.0) {
        discard;
      }
    `},getUniforms:e=>({maskTexture:e.maskTexture})};function Ge(e,t,r){const n=Oe(e),o=Pe(t),a=Ue(r),i=`${n}:${a}:${o}`,s=De[i];if(!s)throw new Error(`Unsupported texture format for SamplesPerPixel=${e}, BitsPerSample=${t}, SampleFormat=${r}`);return s}function Oe(e){if(e===1||e===2||e===3||e===4)return e;throw new Error(`Unsupported SamplesPerPixel ${e}. Only 1, 2, 3, or 4 are supported.`)}function Pe(e){const t=e[0];for(let r=1;r<e.length;r++)if(e[r]!==t)throw new Error(`Unsupported varying BitsPerSample ${e}. All samples must have the same bit width.`);if(t!==8&&t!==16&&t!==32)throw new Error(`Unsupported BitsPerSample ${t}. Only 8, 16, or 32 are supported.`);return t}function Ue(e){const t=e[0];for(let r=1;r<e.length;r++)if(e[r]!==t)throw new Error(`Unsupported varying SampleFormat ${e}. All samples must have the same format.`);switch(t){case K.Uint:return"unorm";case K.Int:return"sint";case K.Float:return"float";default:throw new Error(`Unsupported SampleFormat ${e}`)}}const De={"1:sint:8":"r8sint","1:uint:8":"r8uint","1:unorm:8":"r8unorm","1:float:16":"r16float","1:sint:16":"r16sint","1:uint:16":"r16uint","1:unorm:16":"r16unorm","2:sint:8":"rg8sint","2:uint:8":"rg8uint","2:unorm:8":"rg8unorm","1:float:32":"r32float","1:sint:32":"r32sint","1:uint:32":"r32uint","2:float:16":"rg16float","2:sint:16":"rg16sint","2:uint:16":"rg16uint","2:unorm:16":"rg16unorm","4:sint:8":"rgba8sint","4:uint:8":"rgba8uint","4:unorm:8":"rgba8unorm","3:uint:16":"rgb16unorm-webgl","2:float:32":"rg32float","2:sint:32":"rg32sint","2:uint:32":"rg32uint","4:float:16":"rgba16float","4:sint:16":"rgba16sint","4:uint:16":"rgba16uint","4:unorm:16":"rgba16unorm","3:float:32":"rgb32float-webgl","4:float:32":"rgba32float","4:sint:32":"rgba32sint","4:uint:32":"rgba32uint"};function Be(e,t){const{sampleFormat:r}=e.cachedTags;if(r===null)throw new Error("SampleFormat tag is required to infer render pipeline");if(r[0]===K.Uint)return Ie(e,t);throw new Error(`Inferring render pipeline for non-unsigned integers not yet supported. Found SampleFormat: ${r}`)}function Ie(e,t){const{bitsPerSample:r,colorMap:n,photometric:o,sampleFormat:a,samplesPerPixel:i,nodata:s}=e.cachedTags,u=[{module:ee,props:{textureName:l=>l.texture}}];if(s!==null){const l=2**r[0]-1,h=s/l;u.push({module:$e,props:{value:h}})}e.maskImage!==null&&u.push({module:_e,props:{maskTexture:l=>l.mask}});const p=We({count:i,photometric:o,device:t,colorMap:n});p&&u.push(p);const g=o===_.Palette?{magFilter:"nearest",minFilter:"nearest"}:{magFilter:"linear",minFilter:"linear"};return{getTileData:async(l,h)=>{const{device:f,x:c,y:j,signal:L,pool:C}=h,S=await l.fetchTile(c,j,{boundless:!1,pool:C,signal:L});let{array:d}=S;const{width:M,height:R,mask:v}=d;let y=i;if(i===3&&(d=ve(d),y=4),d.layout==="band-separate")throw new Error("Band-separate images not yet implemented.");const T=Ge(y,r,a);let w=d.data.byteLength;const E=f.createTexture({data:d.data,format:T,width:M,height:R,sampler:g});let $;return v!==null&&($=f.createTexture({data:v,format:"r8unorm",width:M,height:R,sampler:{minFilter:"nearest",magFilter:"nearest"}}),w+=v.byteLength),{texture:E,mask:$,byteLength:w,height:d.height,width:d.width}},renderTile:l=>({renderPipeline:u.map((h,f)=>Ae(h,l))})}}function We({count:e,colorMap:t,device:r,photometric:n}){if(e===3||e===4)return null;switch(n){case _.MinIsWhite:return{module:Se};case _.MinIsBlack:return{module:Re};case _.Rgb:return null;case _.Palette:{if(!t)throw new Error("ColorMap is required for PhotometricInterpretation Palette");const{data:o,width:a,height:i}=he(t),s=r.createTexture({dimension:"2d-array",data:o,format:"rgba8unorm",width:a,height:i,depth:1,mipLevels:1,sampler:{minFilter:"nearest",magFilter:"nearest",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"}});return{module:se,props:{colormapTexture:s}}}case _.Separated:return{module:Le};case _.Ycbcr:return null;case _.Cielab:return{module:Fe};default:throw new Error(`Unsupported PhotometricInterpretation ${n}`)}}function Ae(e,t){const{module:r,props:n}=e;if(!n)return{module:r};const o={};for(const[a,i]of Object.entries(n)){const s=typeof i=="function"?i(t):i;s!==void 0&&(o[a]=s)}return{module:r,props:o}}function ze(e,t){const n=[...[...e.overviews].reverse(),e].map(o=>new ie({affine:o.transform,arrayWidth:o.width,arrayHeight:o.height,tileWidth:o.tileWidth,tileHeight:o.tileHeight,mpu:t.mpu}));return new ce({levels:n,projectTo3857:t.projectTo3857,projectFrom3857:t.projectFrom3857,projectTo4326:t.projectTo4326,projectFrom4326:t.projectFrom4326})}class Q extends Z{static layerName="COGLayer";static defaultProps={...Z.defaultProps,epsgResolver:J};initializeState(){this.setState({})}updateState(t){super.updateState(t);const{props:r,oldProps:n,changeFlags:o}=t;(o.dataChanged||r.geotiff!==n.geotiff)&&(this.clearState(),this._parseGeoTIFF())}clearState(){this.setState({geotiff:void 0,tilesetDescriptor:void 0,defaultGetTileData:void 0,defaultRenderTile:void 0})}async _parseGeoTIFF(){const t=await Te(this.props.geotiff),r=t.crs,n=typeof r=="number"?await this.props.epsgResolver(r):te(r),o=U(n,"EPSG:4326"),a=(f,c)=>o.forward([f,c],!1),i=(f,c)=>o.inverse([f,c],!1),s=U(n,"EPSG:3857"),u=ue((f,c)=>s.forward([f,c],!1),a),p=(f,c)=>s.inverse([f,c],!1),g=n.units;if(!g)throw new Error("Source projection is missing 'units' property, cannot compute meters per unit");const m=le(g,{semiMajorAxis:n.datum?.a??n.a}),b=ze(t,{projectTo4326:a,projectFrom4326:i,projectTo3857:u,projectFrom3857:p,mpu:m});if(this.props.onGeoTIFFLoad){const f=xe(t,o);this.props.onGeoTIFFLoad(t,{projection:n,geographicBounds:f})}let l,h;(!this.props.getTileData||!this.props.renderTile)&&({getTileData:l,renderTile:h}=Be(t,this.context.device)),this.setState({geotiff:t,tilesetDescriptor:b,defaultGetTileData:l,defaultRenderTile:h})}_tilesetDescriptor(){return this.state.tilesetDescriptor}_getTileDataCallback(){const t=this.state.geotiff;if(!t)return;const r=this.props.getTileData??this.state.defaultGetTileData;return r?async(o,a)=>{const{x:i,y:s,z:u}=o.index,p=u===t.overviews.length?t:t.overviews[t.overviews.length-1-u];return r(p,{device:a.device,x:i,y:s,signal:a.signal,pool:this.props.pool??be()})}:void 0}_renderTileCallback(){const t=this.props.renderTile??this.state.defaultRenderTile;if(t)return t}}function Ke({url:e,rasterBand:t,rescaleMin:r,rescaleMax:n,projection:o,projectionDefinitions:a=[],offline:i=!1}){return JSON.stringify([e,t,r,n,o?.epsg??null,o?.definition??null,a,i])}async function re(e,t,r=J,n=[],o=!1){if(typeof e!="number")return te(e);if(t){if(t.epsg!==e)throw new Error(`Embedded projection EPSG:${t.epsg} does not match the COG CRS EPSG:${e}.`);return t.definition}const a=n.find(i=>i.epsg===e);if(a)return a.definition;if(o)throw new Error(`EPSG:${e} is not included in this offline publication.`);return r(e)}async function Ne(e,t,r=J,n=[],o=!1){const a=await re(e,t,r,n,o);if(typeof a!="string")return a;const i=new U.Proj(a);return Object.assign(i,{title:`EPSG:${e}`})}function Ve(e){return[1,3,5].map(t=>parseInt(e.slice(t,t+2),16)/255)}function P(e){if(!Number.isFinite(e))return"0.0";const t=String(e);return/[.eE]/.test(t)?t:`${t}.0`}function H(e){return e.map(P).join(",")}function Ye(e,t=!1,r={},n=null){const o=oe(e,t),a=o.length-1,i=o.slice(0,-1).map((g,m)=>{const b=o[m+1],l=m/a;return`if (value >= ${P(l)}) mapped = mix(vec3(${H(g)}), vec3(${H(b)}), clamp((value - ${P(l)}) * ${P(a)}, 0.0, 1.0));`}).join(`
`),s=n?Object.entries(r).flatMap(([g,m])=>{const b=Number(g);return Number.isFinite(b)?[`if (abs(rawValue - ${P(b)}) < 0.00001) mapped = vec3(${H(Ve(m))});`]:[]}).join(`
`):"",[u,p]=n??[0,1];return{name:`earth-stories-${e}${t?"-reversed":""}`,inject:{"fs:DECKGL_FILTER_COLOR":`
        float encoded = color.r;
        float value = max(0.0, (encoded * 255.0 - 1.0) / 254.0);
        vec3 mapped = vec3(0.0);
        ${i}
        float rawValue = ${P(u)} + value * ${P(p-u||1)};
        ${s}
        color = vec4(mapped, encoded <= 0.0 ? 0.0 : 1.0);
      `}}}function He(e,t,r,n=e.presentation.rescale,o,a=[],i=!1){const{presentation:s}=e,u=h=>Ne(h,e.cog,void 0,a,i);if(!n)return[new Q({id:`${e.id}-cog`,geotiff:t,epsgResolver:u,onGeoTIFFLoad:o,opacity:s.opacity,maxError:.03})];const[p,g]=n,m=g-p||1,b=async(h,f)=>{try{const c=await h.fetchTile(f.x,f.y,{boundless:!1,signal:f.signal??new AbortController().signal}),{width:j,height:L}=c.array,C=Math.max(0,s.rasterBand-1),S=Math.max(1,c.array.count),d=c.array.layout==="band-separate"?c.array.bands[C]??c.array.bands[0]:c.array.data,M=new Uint8Array(j*L);for(let R=0;R<M.length;R+=1){const v=c.array.layout==="band-separate"?R:R*S+Math.min(C,S-1),y=Number(d[v]),T=Number.isFinite(y)&&(c.array.mask===null||c.array.mask[R]!==0)&&(c.array.nodata===null||y!==c.array.nodata);M[R]=T?1+Math.round(Math.max(0,Math.min(254,(y-p)/m*254))):0}return{texture:f.device.createTexture({data:M,format:"r8unorm",width:j,height:L}),width:j,height:L}}catch(c){throw c instanceof Error&&c.name==="AbortError"||r(c instanceof Error?c.message:"The COG tile could not be read."),c}},l=h=>({renderPipeline:[{module:ee,props:{textureName:h.texture}},{module:Ye(s.colormap,s.colormapReversed,s.categoryColors,n)}]});return[new Q({id:`${e.id}-cog`,geotiff:t,epsgResolver:u,onGeoTIFFLoad:o,opacity:s.opacity,getTileData:b,renderTile:l,maxError:.03})]}function nt({asset:e,url:t,onError:r,onBounds:n,onReady:o,projectionDefinitions:a=[],offline:i=!1}){const s=ae(),u=k.useRef(null),[p,g]=k.useState(null),[m,b]=k.useState(null),[l,h]=k.useState(null),f=k.useRef(null),c=k.useRef(r);c.current=r;const j=k.useRef(n);j.current=n;const L=k.useRef(o);L.current=o;const[C,S]=e.presentation.rescale??[null,null],d=Ke({url:t,rasterBand:e.presentation.rasterBand,rescaleMin:C,rescaleMax:S,projection:e.cog,projectionDefinitions:a,offline:i});k.useEffect(()=>{let v=!1;return(async()=>{try{const y=new URL(t,window.location.href).toString(),T=await X.fromUrl(y),w=T.crs,E=await re(w,e.cog,void 0,a,i);let $=C!==null&&S!==null?[C,S]:null;if(!$&&!de(T)&&($=await pe(T,e.presentation.rasterBand)),v)return;u.current={geotiff:T,projection:E};const I=`EARTH_STORIES:${e.id}`;U.defs(I,E);const[G,O,D,B]=T.bbox,x=[[G,O],[D,O],[D,B],[G,B]].map(F=>U(I,"EPSG:4326",F)),W=x.map(F=>F[0]),N=x.map(F=>F[1]);j.current?.([Math.min(...W),Math.min(...N),Math.max(...W),Math.max(...N)]),b({key:d,source:T,rescale:$})}catch(y){v||c.current(y instanceof Error?y.message:"The COG could not be opened.")}})(),()=>{v=!0}},[d]);const M=k.useMemo(()=>m?.key===d?He(e,m.source,r,m.rescale,()=>h(d),a,i):[],[e,i,r,m,d,a]),R=k.useCallback(()=>{l!==d||f.current===d||(f.current=d,L.current?.())},[l,d]);return k.useEffect(()=>{const v=s.current?.getMap();if(!v)return;const y=async T=>{const w=u.current;if(w)try{const E=`EARTH_STORIES:${e.id}`;U.defs(E,w.projection);const[$,I]=U("EPSG:4326",E,[T.lngLat.lng,T.lngLat.lat]),[G,O]=w.geotiff.index($,I);if(G<0||O<0||G>=w.geotiff.height||O>=w.geotiff.width){g(null);return}const D=Math.floor(O/w.geotiff.tileWidth),B=Math.floor(G/w.geotiff.tileHeight),x=await w.geotiff.fetchTile(D,B,{boundless:!0}),W=O-D*w.geotiff.tileWidth,F=(G-B*w.geotiff.tileHeight)*x.array.width+W,V=Math.min(Math.max(0,e.presentation.rasterBand-1),Math.max(0,x.array.count-1)),Y=x.array.layout==="band-separate"?x.array.bands[V]?.[F]:x.array.data[F*x.array.count+V],ne=Y!==void 0&&(x.array.mask===null||x.array.mask[F]!==0)&&(x.array.nodata===null||Y!==x.array.nodata);g(`Band ${V+1}: ${ne?Number(Y).toLocaleString():"no data"}`)}catch(E){r(E instanceof Error?E.message:"The raster pixel could not be inspected.")}};return v.on("click",y),()=>{v.off("click",y)}},[e.presentation.rasterBand,s,r]),A.jsxs(A.Fragment,{children:[A.jsx(me,{layers:M,onAfterRender:R,onError:r}),p?A.jsx("output",{className:"story-map__pixel",children:p}):null]})}export{nt as CogOverlay};
