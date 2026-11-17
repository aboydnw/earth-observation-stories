import{a0 as St,a1 as bt,a2 as wt,L as me,a3 as zt,Z as At,a4 as Tt,a5 as Mt,J as we,p as ze,c as It,a as Ae,U as ct,M as oe,G as xe,I as Z,a6 as Ot,a7 as Et,a8 as Rt,P as Ft,a9 as Bt}from"./mapbox-overlay-BDzZMNgJ.js";import{g as kt}from"./index-CwMo5KhP.js";const ke=`layout(std140) uniform floatColorsUniforms {
  float useByteColors;
} floatColors;

vec3 floatColors_normalize(vec3 inputColor) {
  return floatColors.useByteColors > 0.5 ? inputColor / 255.0 : inputColor;
}

vec4 floatColors_normalize(vec4 inputColor) {
  return floatColors.useByteColors > 0.5 ? inputColor / 255.0 : inputColor;
}

vec4 floatColors_premultiplyAlpha(vec4 inputColor) {
  return vec4(inputColor.rgb * inputColor.a, inputColor.a);
}

vec4 floatColors_unpremultiplyAlpha(vec4 inputColor) {
  return inputColor.a > 0.0 ? vec4(inputColor.rgb / inputColor.a, inputColor.a) : vec4(0.0);
}

vec4 floatColors_premultiply_alpha(vec4 inputColor) {
  return floatColors_premultiplyAlpha(inputColor);
}

vec4 floatColors_unpremultiply_alpha(vec4 inputColor) {
  return floatColors_unpremultiplyAlpha(inputColor);
}
`,Dt=`struct floatColorsUniforms {
  useByteColors: f32
};

@group(0) @binding(auto) var<uniform> floatColors : floatColorsUniforms;

fn floatColors_normalize(inputColor: vec3<f32>) -> vec3<f32> {
  return select(inputColor, inputColor / 255.0, floatColors.useByteColors > 0.5);
}

fn floatColors_normalize4(inputColor: vec4<f32>) -> vec4<f32> {
  return select(inputColor, inputColor / 255.0, floatColors.useByteColors > 0.5);
}

fn floatColors_premultiplyAlpha(inputColor: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(inputColor.rgb * inputColor.a, inputColor.a);
}

fn floatColors_unpremultiplyAlpha(inputColor: vec4<f32>) -> vec4<f32> {
  return select(
    vec4<f32>(0.0),
    vec4<f32>(inputColor.rgb / inputColor.a, inputColor.a),
    inputColor.a > 0.0
  );
}

fn floatColors_premultiply_alpha(inputColor: vec4<f32>) -> vec4<f32> {
  return floatColors_premultiplyAlpha(inputColor);
}

fn floatColors_unpremultiply_alpha(inputColor: vec4<f32>) -> vec4<f32> {
  return floatColors_unpremultiplyAlpha(inputColor);
}
`,Nt={name:"floatColors",props:{},uniforms:{},vs:ke,fs:ke,source:Dt,uniformTypes:{useByteColors:"f32"},defaultUniforms:{useByteColors:!0}},De=`precision highp int;

// #if (defined(SHADER_TYPE_FRAGMENT) && defined(LIGHTING_FRAGMENT)) || (defined(SHADER_TYPE_VERTEX) && defined(LIGHTING_VERTEX))
struct AmbientLight {
  vec3 color;
};

struct PointLight {
  vec3 color;
  vec3 position;
  vec3 attenuation; // 2nd order x:Constant-y:Linear-z:Exponential
};

struct SpotLight {
  vec3 color;
  vec3 position;
  vec3 direction;
  vec3 attenuation;
  vec2 coneCos;
};

struct DirectionalLight {
  vec3 color;
  vec3 direction;
};

struct UniformLight {
  vec3 color;
  vec3 position;
  vec3 direction;
  vec3 attenuation;
  vec2 coneCos;
};

layout(std140) uniform lightingUniforms {
  int enabled;
  int directionalLightCount;
  int pointLightCount;
  int spotLightCount;
  vec3 ambientColor;
  UniformLight lights[5];
} lighting;

PointLight lighting_getPointLight(int index) {
  UniformLight light = lighting.lights[index];
  return PointLight(light.color, light.position, light.attenuation);
}

SpotLight lighting_getSpotLight(int index) {
  UniformLight light = lighting.lights[lighting.pointLightCount + index];
  return SpotLight(light.color, light.position, light.direction, light.attenuation, light.coneCos);
}

DirectionalLight lighting_getDirectionalLight(int index) {
  UniformLight light =
    lighting.lights[lighting.pointLightCount + lighting.spotLightCount + index];
  return DirectionalLight(light.color, light.direction);
}

float getPointLightAttenuation(PointLight pointLight, float distance) {
  return pointLight.attenuation.x
       + pointLight.attenuation.y * distance
       + pointLight.attenuation.z * distance * distance;
}

float getSpotLightAttenuation(SpotLight spotLight, vec3 positionWorldspace) {
  vec3 light_direction = normalize(positionWorldspace - spotLight.position);
  float coneFactor = smoothstep(
    spotLight.coneCos.y,
    spotLight.coneCos.x,
    dot(normalize(spotLight.direction), light_direction)
  );
  float distanceAttenuation = getPointLightAttenuation(
    PointLight(spotLight.color, spotLight.position, spotLight.attenuation),
    distance(spotLight.position, positionWorldspace)
  );
  return distanceAttenuation / max(coneFactor, 0.0001);
}

// #endif
`,Gt=`// #if (defined(SHADER_TYPE_FRAGMENT) && defined(LIGHTING_FRAGMENT)) || (defined(SHADER_TYPE_VERTEX) && defined(LIGHTING_VERTEX))
const MAX_LIGHTS: i32 = 5;

struct AmbientLight {
  color: vec3<f32>,
};

struct PointLight {
  color: vec3<f32>,
  position: vec3<f32>,
  attenuation: vec3<f32>, // 2nd order x:Constant-y:Linear-z:Exponential
};

struct SpotLight {
  color: vec3<f32>,
  position: vec3<f32>,
  direction: vec3<f32>,
  attenuation: vec3<f32>,
  coneCos: vec2<f32>,
};

struct DirectionalLight {
  color: vec3<f32>,
  direction: vec3<f32>,
};

struct UniformLight {
  color: vec3<f32>,
  position: vec3<f32>,
  direction: vec3<f32>,
  attenuation: vec3<f32>,
  coneCos: vec2<f32>,
};

struct lightingUniforms {
  enabled: i32,
  directionalLightCount: i32,
  pointLightCount: i32,
  spotLightCount: i32,
  ambientColor: vec3<f32>,
  lights: array<UniformLight, 5>,
};

@group(2) @binding(auto) var<uniform> lighting : lightingUniforms;

fn lighting_getPointLight(index: i32) -> PointLight {
  let light = lighting.lights[index];
  return PointLight(light.color, light.position, light.attenuation);
}

fn lighting_getSpotLight(index: i32) -> SpotLight {
  let light = lighting.lights[lighting.pointLightCount + index];
  return SpotLight(light.color, light.position, light.direction, light.attenuation, light.coneCos);
}

fn lighting_getDirectionalLight(index: i32) -> DirectionalLight {
  let light = lighting.lights[lighting.pointLightCount + lighting.spotLightCount + index];
  return DirectionalLight(light.color, light.direction);
}

fn getPointLightAttenuation(pointLight: PointLight, distance: f32) -> f32 {
  return pointLight.attenuation.x
       + pointLight.attenuation.y * distance
       + pointLight.attenuation.z * distance * distance;
}

fn getSpotLightAttenuation(spotLight: SpotLight, positionWorldspace: vec3<f32>) -> f32 {
  let lightDirection = normalize(positionWorldspace - spotLight.position);
  let coneFactor = smoothstep(
    spotLight.coneCos.y,
    spotLight.coneCos.x,
    dot(normalize(spotLight.direction), lightDirection)
  );
  let distanceAttenuation = getPointLightAttenuation(
    PointLight(spotLight.color, spotLight.position, spotLight.attenuation),
    distance(spotLight.position, positionWorldspace)
  );
  return distanceAttenuation / max(coneFactor, 0.0001);
}
`,X=5,Ut={color:"vec3<f32>",position:"vec3<f32>",direction:"vec3<f32>",attenuation:"vec3<f32>",coneCos:"vec2<f32>"},Wt={props:{},uniforms:{},name:"lighting",defines:{},uniformTypes:{enabled:"i32",directionalLightCount:"i32",pointLightCount:"i32",spotLightCount:"i32",ambientColor:"vec3<f32>",lights:[Ut,X]},defaultUniforms:fe(),bindingLayout:[{name:"lighting",group:2}],firstBindingSlot:0,source:Gt,vs:De,fs:De,getUniforms:Ht};function Ht(o,e={}){if(o=o&&{...o},!o)return fe();o.lights&&(o={...o,...Vt(o.lights),lights:void 0});const{useByteColors:t,ambientLight:i,pointLights:s,spotLights:n,directionalLights:r}=o||{};if(!(i||s&&s.length>0||n&&n.length>0||r&&r.length>0))return{...fe(),enabled:0};const c={...fe(),...jt({useByteColors:t,ambientLight:i,pointLights:s,spotLights:n,directionalLights:r})};return o.enabled!==void 0&&(c.enabled=o.enabled?1:0),c}function jt({useByteColors:o,ambientLight:e,pointLights:t=[],spotLights:i=[],directionalLights:s=[]}){const n=gt();let r=0,a=0,c=0,f=0;for(const p of t){if(r>=X)break;n[r]={...n[r],color:ae(p,o),position:p.position,attenuation:p.attenuation||[1,0,0]},r++,a++}for(const p of i){if(r>=X)break;n[r]={...n[r],color:ae(p,o),position:p.position,direction:p.direction,attenuation:p.attenuation||[1,0,0],coneCos:Zt(p)},r++,c++}for(const p of s){if(r>=X)break;n[r]={...n[r],color:ae(p,o),direction:p.direction},r++,f++}return t.length+i.length+s.length>X&&St.warn(`MAX_LIGHTS exceeded, truncating to ${X}`)(),{ambientColor:ae(e,o),directionalLightCount:f,pointLightCount:a,spotLightCount:c,lights:n}}function Vt(o){const e={pointLights:[],spotLights:[],directionalLights:[]};for(const t of o||[])switch(t.type){case"ambient":e.ambientLight=t;break;case"directional":e.directionalLights?.push(t);break;case"point":e.pointLights?.push(t);break;case"spot":e.spotLights?.push(t);break}return e}function ae(o={},e){const{color:t=[0,0,0],intensity:i=1}=o;return bt(t,wt(e,!0)).map(n=>n*i)}function fe(){return{enabled:1,directionalLightCount:0,pointLightCount:0,spotLightCount:0,ambientColor:[.1,.1,.1],lights:gt()}}function gt(){return Array.from({length:X},()=>$t())}function $t(){return{color:[1,1,1],position:[1,1,2],direction:[1,1,1],attenuation:[1,0,0],coneCos:[1,0]}}function Zt(o){const e=o.innerConeAngle??0,t=o.outerConeAngle??Math.PI/4;return[Math.cos(e),Math.cos(t)]}const Kt=`layout(std140) uniform phongMaterialUniforms {
  uniform bool unlit;
  uniform float ambient;
  uniform float diffuse;
  uniform float shininess;
  uniform vec3  specularColor;
} material;
`,Yt=`layout(std140) uniform phongMaterialUniforms {
  uniform bool unlit;
  uniform float ambient;
  uniform float diffuse;
  uniform float shininess;
  uniform vec3  specularColor;
} material;

vec3 lighting_getLightColor(vec3 surfaceColor, vec3 light_direction, vec3 view_direction, vec3 normal_worldspace, vec3 color) {
  vec3 halfway_direction = normalize(light_direction + view_direction);
  float lambertian = dot(light_direction, normal_worldspace);
  float specular = 0.0;
  if (lambertian > 0.0) {
    float specular_angle = max(dot(normal_worldspace, halfway_direction), 0.0);
    specular = pow(specular_angle, material.shininess);
  }
  lambertian = max(lambertian, 0.0);
  return (lambertian * material.diffuse * surfaceColor + specular * floatColors_normalize(material.specularColor)) * color;
}

vec3 lighting_getLightColor(vec3 surfaceColor, vec3 cameraPosition, vec3 position_worldspace, vec3 normal_worldspace) {
  vec3 lightColor = surfaceColor;

  if (material.unlit) {
    return surfaceColor;
  }

  if (lighting.enabled == 0) {
    return lightColor;
  }

  vec3 view_direction = normalize(cameraPosition - position_worldspace);
  lightColor = material.ambient * surfaceColor * lighting.ambientColor;

  for (int i = 0; i < lighting.pointLightCount; i++) {
    PointLight pointLight = lighting_getPointLight(i);
    vec3 light_position_worldspace = pointLight.position;
    vec3 light_direction = normalize(light_position_worldspace - position_worldspace);
    float light_attenuation = getPointLightAttenuation(pointLight, distance(light_position_worldspace, position_worldspace));
    lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color / light_attenuation);
  }

  for (int i = 0; i < lighting.spotLightCount; i++) {
    SpotLight spotLight = lighting_getSpotLight(i);
    vec3 light_position_worldspace = spotLight.position;
    vec3 light_direction = normalize(light_position_worldspace - position_worldspace);
    float light_attenuation = getSpotLightAttenuation(spotLight, position_worldspace);
    lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, spotLight.color / light_attenuation);
  }

  for (int i = 0; i < lighting.directionalLightCount; i++) {
    DirectionalLight directionalLight = lighting_getDirectionalLight(i);
    lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
  }
  
  return lightColor;
}
`,Xt=`struct phongMaterialUniforms {
  unlit: u32,
  ambient: f32,
  diffuse: f32,
  shininess: f32,
  specularColor: vec3<f32>,
};

@group(3) @binding(auto) var<uniform> phongMaterial : phongMaterialUniforms;

fn lighting_getLightColor(surfaceColor: vec3<f32>, light_direction: vec3<f32>, view_direction: vec3<f32>, normal_worldspace: vec3<f32>, color: vec3<f32>) -> vec3<f32> {
  let halfway_direction: vec3<f32> = normalize(light_direction + view_direction);
  var lambertian: f32 = dot(light_direction, normal_worldspace);
  var specular: f32 = 0.0;
  if (lambertian > 0.0) {
    let specular_angle = max(dot(normal_worldspace, halfway_direction), 0.0);
    specular = pow(specular_angle, phongMaterial.shininess);
  }
  lambertian = max(lambertian, 0.0);
  return (
    lambertian * phongMaterial.diffuse * surfaceColor +
    specular * floatColors_normalize(phongMaterial.specularColor)
  ) * color;
}

fn lighting_getLightColor2(surfaceColor: vec3<f32>, cameraPosition: vec3<f32>, position_worldspace: vec3<f32>, normal_worldspace: vec3<f32>) -> vec3<f32> {
  var lightColor: vec3<f32> = surfaceColor;

  if (phongMaterial.unlit != 0u) {
    return surfaceColor;
  }

  if (lighting.enabled == 0) {
    return lightColor;
  }

  let view_direction: vec3<f32> = normalize(cameraPosition - position_worldspace);
  lightColor = phongMaterial.ambient * surfaceColor * lighting.ambientColor;

  for (var i: i32 = 0; i < lighting.pointLightCount; i++) {
    let pointLight: PointLight = lighting_getPointLight(i);
    let light_position_worldspace: vec3<f32> = pointLight.position;
    let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);
    let light_attenuation = getPointLightAttenuation(
      pointLight,
      distance(light_position_worldspace, position_worldspace)
    );
    lightColor += lighting_getLightColor(
      surfaceColor,
      light_direction,
      view_direction,
      normal_worldspace,
      pointLight.color / light_attenuation
    );
  }

  for (var i: i32 = 0; i < lighting.spotLightCount; i++) {
    let spotLight: SpotLight = lighting_getSpotLight(i);
    let light_position_worldspace: vec3<f32> = spotLight.position;
    let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);
    let light_attenuation = getSpotLightAttenuation(spotLight, position_worldspace);
    lightColor += lighting_getLightColor(
      surfaceColor,
      light_direction,
      view_direction,
      normal_worldspace,
      spotLight.color / light_attenuation
    );
  }

  for (var i: i32 = 0; i < lighting.directionalLightCount; i++) {
    let directionalLight: DirectionalLight = lighting_getDirectionalLight(i);
    lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
  }  
  
  return lightColor;
}

fn lighting_getSpecularLightColor(cameraPosition: vec3<f32>, position_worldspace: vec3<f32>, normal_worldspace: vec3<f32>) -> vec3<f32>{
  var lightColor = vec3<f32>(0, 0, 0);
  let surfaceColor = vec3<f32>(0, 0, 0);

  if (lighting.enabled != 0) {
    let view_direction = normalize(cameraPosition - position_worldspace);

    for (var i: i32 = 0; i < lighting.pointLightCount; i++) {
      let pointLight: PointLight = lighting_getPointLight(i);
      let light_position_worldspace: vec3<f32> = pointLight.position;
      let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);
      let light_attenuation = getPointLightAttenuation(
        pointLight,
        distance(light_position_worldspace, position_worldspace)
      );
      lightColor += lighting_getLightColor(
        surfaceColor,
        light_direction,
        view_direction,
        normal_worldspace,
        pointLight.color / light_attenuation
      );
    }

    for (var i: i32 = 0; i < lighting.spotLightCount; i++) {
      let spotLight: SpotLight = lighting_getSpotLight(i);
      let light_position_worldspace: vec3<f32> = spotLight.position;
      let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);
      let light_attenuation = getSpotLightAttenuation(spotLight, position_worldspace);
      lightColor += lighting_getLightColor(
        surfaceColor,
        light_direction,
        view_direction,
        normal_worldspace,
        spotLight.color / light_attenuation
      );
    }

    for (var i: i32 = 0; i < lighting.directionalLightCount; i++) {
        let directionalLight: DirectionalLight = lighting_getDirectionalLight(i);
        lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
    }
  }
  return lightColor;
}
`,Jt=[38.25,38.25,38.25],ut={props:{},name:"gouraudMaterial",bindingLayout:[{name:"gouraudMaterial",group:3}],vs:Yt.replace("phongMaterial","gouraudMaterial"),fs:Kt.replace("phongMaterial","gouraudMaterial"),source:Xt.replaceAll("phongMaterial","gouraudMaterial"),defines:{LIGHTING_VERTEX:!0},dependencies:[Wt,Nt],uniformTypes:{unlit:"i32",ambient:"f32",diffuse:"f32",shininess:"f32",specularColor:"vec3<f32>"},defaultUniforms:{unlit:!1,ambient:.35,diffuse:.6,shininess:32,specularColor:Jt},getUniforms(o){return{...ut.defaultUniforms,...o}}},qt="compositeLayer.renderLayers";class Te extends me{get isComposite(){return!0}get isDrawable(){return!1}get isLoaded(){return super.isLoaded&&this.getSubLayers().every(e=>e.isLoaded)}getSubLayers(){return this.internalState&&this.internalState.subLayers||[]}initializeState(e){}setState(e){super.setState(e),this.setNeedsUpdate()}getPickingInfo({info:e}){const{object:t}=e;return t&&t.__source&&t.__source.parent&&t.__source.parent.id===this.id&&(e.object=t.__source.object,e.index=t.__source.index),e}filterSubLayer(e){return!0}shouldRenderSubLayer(e,t){return t&&t.length}getSubLayerClass(e,t){const{_subLayerProps:i}=this.props;return i&&i[e]&&i[e].type||t}getSubLayerRow(e,t,i){return e.__source={parent:this,object:t,index:i},e}getSubLayerAccessor(e){if(typeof e=="function"){const t={index:-1,data:this.props.data,target:[]};return(i,s)=>i&&i.__source?(t.index=i.__source.index,e(i.__source.object,t)):e(i,s)}return e}getSubLayerProps(e={}){const{opacity:t,pickable:i,visible:s,parameters:n,getPolygonOffset:r,highlightedObjectIndex:a,autoHighlight:c,highlightColor:f,coordinateSystem:p,coordinateOrigin:x,wrapLongitude:m,positionFormat:C,modelMatrix:b,extensions:O,fetch:z,operation:A,_subLayerProps:N}=this.props,S={id:"",updateTriggers:{},opacity:t,pickable:i,visible:s,parameters:n,getPolygonOffset:r,highlightedObjectIndex:a,autoHighlight:c,highlightColor:f,coordinateSystem:p,coordinateOrigin:x,wrapLongitude:m,positionFormat:C,modelMatrix:b,extensions:O,fetch:z,operation:A},w=N&&e.id&&N[e.id],E=w&&w.updateTriggers,k=e.id||"sublayer";if(w){const G=this.props[zt],U=e.type?e.type._propTypes:{};for(const R in w){const W=U[R]||G[R];W&&W.type==="accessor"&&(w[R]=this.getSubLayerAccessor(w[R]))}}Object.assign(S,e,w),S.id=`${this.props.id}-${k}`,S.updateTriggers={all:this.props.updateTriggers?.all,...e.updateTriggers,...E};for(const G of O){const U=G.getSubLayerProps.call(this,G);U&&Object.assign(S,U,{updateTriggers:Object.assign(S.updateTriggers,U.updateTriggers)})}return S}_updateAutoHighlight(e){for(const t of this.getSubLayers())t.updateAutoHighlight(e)}_getAttributeManager(){return null}_postUpdate(e,t){let i=this.internalState.subLayers;const s=!i||this.needsUpdate();if(s){const n=this.renderLayers();i=At(n,Boolean),this.internalState.subLayers=i}Tt(qt,this,s,i);for(const n of i)n.parent=this}}Te.layerName="CompositeLayer";const Ne=`layout(std140) uniform iconUniforms {
  float sizeScale;
  vec2 iconsTextureDim;
  float sizeBasis;
  float sizeMinPixels;
  float sizeMaxPixels;
  bool billboard;
  highp int sizeUnits;
  float alphaCutoff;
} icon;
`,Qt={name:"icon",vs:Ne,fs:Ne,uniformTypes:{sizeScale:"f32",iconsTextureDim:"vec2<f32>",sizeBasis:"f32",sizeMinPixels:"f32",sizeMaxPixels:"f32",billboard:"f32",sizeUnits:"i32",alphaCutoff:"f32"}},ei=`#version 300 es
#define SHADER_NAME icon-layer-vertex-shader
in vec2 positions;
in vec3 instancePositions;
in vec3 instancePositions64Low;
in float instanceSizes;
in float instanceAngles;
in vec4 instanceColors;
in vec3 instancePickingColors;
in vec4 instanceIconFrames;
in float instanceColorModes;
in vec2 instanceOffsets;
in vec2 instancePixelOffset;
out float vColorMode;
out vec4 vColor;
out vec2 vTextureCoords;
out vec2 uv;
vec2 rotate_by_angle(vec2 vertex, float angle) {
float angle_radian = angle * PI / 180.0;
float cos_angle = cos(angle_radian);
float sin_angle = sin(angle_radian);
mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
return rotationMatrix * vertex;
}
void main(void) {
geometry.worldPosition = instancePositions;
geometry.uv = positions;
geometry.pickingColor = instancePickingColors;
uv = positions;
vec2 iconSize = instanceIconFrames.zw;
float sizePixels = clamp(
project_size_to_pixel(instanceSizes * icon.sizeScale, icon.sizeUnits),
icon.sizeMinPixels, icon.sizeMaxPixels
);
float iconConstraint = icon.sizeBasis == 0.0 ? iconSize.x : iconSize.y;
float instanceScale = iconConstraint == 0.0 ? 0.0 : sizePixels / iconConstraint;
vec2 pixelOffset = positions / 2.0 * iconSize + instanceOffsets;
pixelOffset = rotate_by_angle(pixelOffset, instanceAngles) * instanceScale;
pixelOffset += instancePixelOffset;
pixelOffset.y *= -1.0;
if (icon.billboard)  {
gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
vec3 offset = vec3(pixelOffset, 0.0);
DECKGL_FILTER_SIZE(offset, geometry);
gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
} else {
vec3 offset_common = vec3(project_pixel_size(pixelOffset), 0.0);
DECKGL_FILTER_SIZE(offset_common, geometry);
gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset_common, geometry.position);
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
}
vTextureCoords = mix(
instanceIconFrames.xy,
instanceIconFrames.xy + iconSize,
(positions.xy + 1.0) / 2.0
) / icon.iconsTextureDim;
vColor = instanceColors;
DECKGL_FILTER_COLOR(vColor, geometry);
vColorMode = instanceColorModes;
}
`,ti=`#version 300 es
#define SHADER_NAME icon-layer-fragment-shader
precision highp float;
uniform sampler2D iconsTexture;
in float vColorMode;
in vec4 vColor;
in vec2 vTextureCoords;
in vec2 uv;
out vec4 fragColor;
void main(void) {
geometry.uv = uv;
vec4 texColor = texture(iconsTexture, vTextureCoords);
vec3 color = mix(texColor.rgb, vColor.rgb, vColorMode);
float a = texColor.a * layer.opacity * vColor.a;
if (a < icon.alphaCutoff) {
discard;
}
fragColor = vec4(color, a);
DECKGL_FILTER_COLOR(fragColor, geometry);
}
`,ii=`struct IconUniforms {
  sizeScale: f32,
  iconsTextureDim: vec2<f32>,
  sizeBasis: f32,
  sizeMinPixels: f32,
  sizeMaxPixels: f32,
  billboard: i32,
  sizeUnits: i32,
  alphaCutoff: f32
};

@group(0) @binding(auto) var<uniform> icon: IconUniforms;
@group(0) @binding(auto) var iconsTexture : texture_2d<f32>;
@group(0) @binding(auto) var iconsTextureSampler : sampler;

fn rotate_by_angle(vertex: vec2<f32>, angle_deg: f32) -> vec2<f32> {
  let angle_radian = angle_deg * PI / 180.0;
  let c = cos(angle_radian);
  let s = sin(angle_radian);
  let rotation = mat2x2<f32>(vec2<f32>(c, s), vec2<f32>(-s, c));
  return rotation * vertex;
}

struct Attributes {
  @location(0) positions: vec2<f32>,

  @location(1) instancePositions: vec3<f32>,
  @location(2) instancePositions64Low: vec3<f32>,
  @location(3) instanceSizes: f32,
  @location(4) instanceAngles: f32,
  @location(5) instanceColors: vec4<f32>,
  @location(6) instancePickingColors: vec3<f32>,
  @location(7) instanceIconFrames: vec4<f32>,
  @location(8) instanceColorModes: f32,
  @location(9) instanceOffsets: vec2<f32>,
  @location(10) instancePixelOffset: vec2<f32>,
};

struct Varyings {
  @builtin(position) position: vec4<f32>,

  @location(0) vColorMode: f32,
  @location(1) vColor: vec4<f32>,
  @location(2) vTextureCoords: vec2<f32>,
  @location(3) uv: vec2<f32>,
  @location(4) pickingColor: vec3<f32>,
};

@vertex
fn vertexMain(inp: Attributes) -> Varyings {
  // write geometry fields used by filters + FS
  geometry.worldPosition = inp.instancePositions;
  geometry.uv = inp.positions;
  geometry.pickingColor = inp.instancePickingColors;

  var outp: Varyings;
  outp.uv = inp.positions;

  let iconSize = inp.instanceIconFrames.zw;

  // convert size in meters to pixels, then clamp
  let sizePixels = clamp(
    project_unit_size_to_pixel(inp.instanceSizes * icon.sizeScale, icon.sizeUnits),
    icon.sizeMinPixels, icon.sizeMaxPixels
  );

  // scale icon height to match instanceSize
  let iconConstraint = select(iconSize.y, iconSize.x, icon.sizeBasis == 0.0);
  let instanceScale = select(sizePixels / iconConstraint, 0.0, iconConstraint == 0.0);

  // scale and rotate vertex in "pixel" units; then add per-instance pixel offset
  var pixelOffset = inp.positions / 2.0 * iconSize + inp.instanceOffsets;
  pixelOffset = rotate_by_angle(pixelOffset, inp.instanceAngles) * instanceScale;
  pixelOffset = pixelOffset + inp.instancePixelOffset;
  pixelOffset.y = pixelOffset.y * -1.0;

  if (icon.billboard != 0) {
    var pos = project_position_to_clipspace(inp.instancePositions, inp.instancePositions64Low, vec3<f32>(0.0)); // TODO, &geometry.position);
    // DECKGL_FILTER_GL_POSITION(pos, geometry);

    var offset = vec3<f32>(pixelOffset, 0.0);
    // DECKGL_FILTER_SIZE(offset, geometry);
    let clipOffset = project_pixel_size_to_clipspace(offset.xy);
    pos = vec4<f32>(pos.x + clipOffset.x, pos.y + clipOffset.y, pos.z, pos.w);
    outp.position = pos;
  } else {
    var offset_common = vec3<f32>(project_pixel_size_vec2(pixelOffset), 0.0);
    // DECKGL_FILTER_SIZE(offset_common, geometry);
    var pos = project_position_to_clipspace(inp.instancePositions, inp.instancePositions64Low, offset_common); // TODO, &geometry.position);
    // DECKGL_FILTER_GL_POSITION(pos, geometry);
    outp.position = pos;
  }

  let uvMix = (inp.positions.xy + vec2<f32>(1.0, 1.0)) * 0.5;
  outp.vTextureCoords = mix(inp.instanceIconFrames.xy, inp.instanceIconFrames.xy + iconSize, uvMix) / icon.iconsTextureDim;

  outp.vColor = inp.instanceColors;
  // DECKGL_FILTER_COLOR(outp.vColor, geometry);

  outp.vColorMode = inp.instanceColorModes;
  outp.pickingColor = inp.instancePickingColors;

  return outp;
}

@fragment
fn fragmentMain(inp: Varyings) -> @location(0) vec4<f32> {
  // expose to deck.gl filter hooks
  geometry.uv = inp.uv;

  let texColor = textureSample(iconsTexture, iconsTextureSampler, inp.vTextureCoords);

  // if colorMode == 0, use pixel color from the texture
  // if colorMode == 1 (or picking), use texture as transparency mask
  let rgb = mix(texColor.rgb, inp.vColor.rgb, inp.vColorMode);
  let a = texColor.a * layer.opacity * inp.vColor.a;

  if (a < icon.alphaCutoff) {
    discard;
  }

  if (picking.isActive > 0.5) {
    if (!picking_isColorValid(inp.pickingColor)) {
      discard;
    }
    return vec4<f32>(inp.pickingColor, 1.0);
  }

  var fragColor = deckgl_premultiplied_alpha(vec4<f32>(rgb, a));

  if (picking.isHighlightActive > 0.5) {
    let highlightedObjectColor = picking_normalizeColor(picking.highlightedObjectColor);
    if (picking_isColorZero(abs(inp.pickingColor - highlightedObjectColor))) {
      let highLightAlpha = picking.highlightColor.a;
      let blendedAlpha = highLightAlpha + fragColor.a * (1.0 - highLightAlpha);
      if (blendedAlpha > 0.0) {
        let highLightRatio = highLightAlpha / blendedAlpha;
        fragColor = vec4<f32>(
          mix(fragColor.rgb, picking.highlightColor.rgb, highLightRatio),
          blendedAlpha
        );
      } else {
        fragColor = vec4<f32>(fragColor.rgb, 0.0);
      }
    }
  }

  return fragColor;
}
`,oi=1024,ni=4,Ge=()=>{},Ue={minFilter:"linear",mipmapFilter:"linear",magFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"},si={x:0,y:0,width:0,height:0};function ri(o){return Math.pow(2,Math.ceil(Math.log2(o)))}function ai(o,e,t,i){const s=Math.min(t/e.width,i/e.height),n=Math.floor(e.width*s),r=Math.floor(e.height*s);return s===1?{image:e,width:n,height:r}:(o.canvas.height=r,o.canvas.width=n,o.clearRect(0,0,n,r),o.drawImage(e,0,0,e.width,e.height,0,0,n,r),{image:o.canvas,width:n,height:r})}function re(o){return o&&(o.id||o.url)}function ft(o){const{device:e}=o;e.type==="webgl"?o.generateMipmapsWebGL():e.type==="webgpu"&&e.generateMipmapsWebGPU(o)}function li(o,e,t,i){const{width:s,height:n,device:r}=o,a=r.createTexture({format:"rgba8unorm",width:e,height:t,sampler:i,mipLevels:r.getMipLevelCount(e,t)}),c=r.createCommandEncoder();c.copyTextureToTexture({sourceTexture:o,destinationTexture:a,width:s,height:n});const f=c.finish();return r.submit(f),ft(a),o.destroy(),a}function We(o,e,t){for(let i=0;i<e.length;i++){const{icon:s,xOffset:n}=e[i],r=re(s);o[r]={...s,x:n,y:t}}}function ci({icons:o,buffer:e,mapping:t={},xOffset:i=0,yOffset:s=0,rowHeight:n=0,canvasWidth:r}){let a=[];for(let c=0;c<o.length;c++){const f=o[c],p=re(f);if(!t[p]){const{height:x,width:m}=f;i+m+e>r&&(We(t,a,s),i=0,s=n+s+e,n=0,a=[]),a.push({icon:f,xOffset:i}),i=i+m+e,n=Math.max(n,x)}}return a.length>0&&We(t,a,s),{mapping:t,rowHeight:n,xOffset:i,yOffset:s,canvasWidth:r,canvasHeight:ri(n+s+e)}}function gi(o,e,t){if(!o||!e)return null;t=t||{};const i={},{iterable:s,objectInfo:n}=we(o);for(const r of s){n.index++;const a=e(r,n),c=re(a);if(!a)throw new Error("Icon is missing.");if(!a.url)throw new Error("Icon url is missing.");!i[c]&&(!t[c]||a.url!==t[c].url)&&(i[c]={...a,source:r,sourceIndex:n.index})}return i}class ui{constructor(e,{onUpdate:t=Ge,onError:i=Ge}){this._loadOptions=null,this._texture=null,this._externalTexture=null,this._mapping={},this._samplerParameters=null,this._pendingCount=0,this._autoPacking=!1,this._xOffset=0,this._yOffset=0,this._rowHeight=0,this._buffer=ni,this._canvasWidth=oi,this._canvasHeight=0,this._canvas=null,this.device=e,this.onUpdate=t,this.onError=i}finalize(){this._texture?.delete()}getTexture(){return this._texture||this._externalTexture}getIconMapping(e){const t=this._autoPacking?re(e):e;return this._mapping[t]||si}setProps({loadOptions:e,autoPacking:t,iconAtlas:i,iconMapping:s,textureParameters:n}){e&&(this._loadOptions=e),t!==void 0&&(this._autoPacking=t),s&&(this._mapping=s),i&&(this._texture?.delete(),this._texture=null,this._externalTexture=i),n&&(this._samplerParameters=n)}get isLoaded(){return this._pendingCount===0}packIcons(e,t){if(!this._autoPacking||typeof document>"u")return;const i=Object.values(gi(e,t,this._mapping)||{});if(i.length>0){const{mapping:s,xOffset:n,yOffset:r,rowHeight:a,canvasHeight:c}=ci({icons:i,buffer:this._buffer,canvasWidth:this._canvasWidth,mapping:this._mapping,rowHeight:this._rowHeight,xOffset:this._xOffset,yOffset:this._yOffset});this._rowHeight=a,this._mapping=s,this._xOffset=n,this._yOffset=r,this._canvasHeight=c,this._texture||(this._texture=this.device.createTexture({format:"rgba8unorm",data:null,width:this._canvasWidth,height:this._canvasHeight,sampler:this._samplerParameters||Ue,mipLevels:this.device.getMipLevelCount(this._canvasWidth,this._canvasHeight)})),this._texture.height!==this._canvasHeight&&(this._texture=li(this._texture,this._canvasWidth,this._canvasHeight,this._samplerParameters||Ue)),this.onUpdate(!0),this._canvas=this._canvas||document.createElement("canvas"),this._loadIcons(i)}}_loadIcons(e){const t=this._canvas.getContext("2d",{willReadFrequently:!0});for(const i of e)this._pendingCount++,Mt(i.url,this._loadOptions).then(s=>{const n=re(i),r=this._mapping[n],{x:a,y:c,width:f,height:p}=r,{image:x,width:m,height:C}=ai(t,s,f,p),b=a+(f-m)/2,O=c+(p-C)/2;this._texture?.copyExternalImage({image:x,x:b,y:O,width:m,height:C}),r.x=b,r.y=O,r.width=m,r.height=C,this._texture&&ft(this._texture),this.onUpdate(m!==f||C!==p)}).catch(s=>{this.onError({url:i.url,source:i.source,sourceIndex:i.sourceIndex,loadOptions:this._loadOptions,error:s})}).finally(()=>{this._pendingCount--})}}const pt=[0,0,0,255],fi={iconAtlas:{type:"image",value:null,async:!0},iconMapping:{type:"object",value:{},async:!0},sizeScale:{type:"number",value:1,min:0},billboard:!0,sizeUnits:"pixels",sizeBasis:"height",sizeMinPixels:{type:"number",min:0,value:0},sizeMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},alphaCutoff:{type:"number",value:.05,min:0,max:1},getPosition:{type:"accessor",value:o=>o.position},getIcon:{type:"accessor",value:o=>o.icon},getColor:{type:"accessor",value:pt},getSize:{type:"accessor",value:1},getAngle:{type:"accessor",value:0},getPixelOffset:{type:"accessor",value:[0,0]},onIconError:{type:"function",value:null,optional:!0},textureParameters:{type:"object",ignore:!0,value:null}};class _e extends me{getShaders(){return super.getShaders({vs:ei,fs:ti,source:ii,modules:[ze,It,Ae,Qt]})}initializeState(){this.state={iconManager:new ui(this.context.device,{onUpdate:this._onUpdate.bind(this),onError:this._onError.bind(this)})},this.getAttributeManager().addInstanced({instancePositions:{size:3,type:"float64",fp64:this.use64bitPositions(),transition:!0,accessor:"getPosition"},instanceSizes:{size:1,transition:!0,accessor:"getSize",defaultValue:1},instanceIconDefs:{size:7,accessor:"getIcon",transform:this.getInstanceIconDef,shaderAttributes:{instanceOffsets:{size:2,elementOffset:0},instanceIconFrames:{size:4,elementOffset:2},instanceColorModes:{size:1,elementOffset:6}}},instanceColors:{size:this.props.colorFormat.length,type:"unorm8",transition:!0,accessor:"getColor",defaultValue:pt},instanceAngles:{size:1,transition:!0,accessor:"getAngle"},instancePixelOffset:{size:2,transition:!0,accessor:"getPixelOffset"}})}updateState(e){super.updateState(e);const{props:t,oldProps:i,changeFlags:s}=e,n=this.getAttributeManager(),{iconAtlas:r,iconMapping:a,data:c,getIcon:f,textureParameters:p}=t,{iconManager:x}=this.state;if(typeof r=="string")return;const m=r||this.internalState.isAsyncPropLoading("iconAtlas");x.setProps({loadOptions:t.loadOptions,autoPacking:!m,iconAtlas:r,iconMapping:m?a:null,textureParameters:p}),m?i.iconMapping!==t.iconMapping&&n.invalidate("getIcon"):(s.dataChanged||s.updateTriggersChanged&&(s.updateTriggersChanged.all||s.updateTriggersChanged.getIcon))&&x.packIcons(c,f),s.extensionsChanged&&(this.state.model?.destroy(),this.state.model=this._getModel(),n.invalidateAll())}get isLoaded(){return super.isLoaded&&this.state.iconManager.isLoaded}finalizeState(e){super.finalizeState(e),this.state.iconManager.finalize()}draw({uniforms:e}){const{sizeScale:t,sizeBasis:i,sizeMinPixels:s,sizeMaxPixels:n,sizeUnits:r,billboard:a,alphaCutoff:c}=this.props,{iconManager:f}=this.state,p=f.getTexture();if(p){const x=this.state.model,m={iconsTexture:p,iconsTextureDim:[p.width,p.height],sizeUnits:ct[r],sizeScale:t,sizeBasis:i==="height"?1:0,sizeMinPixels:s,sizeMaxPixels:n,billboard:a,alphaCutoff:c};x.shaderInputs.setProps({icon:m}),x.draw(this.context.renderPass)}}_getModel(){const e=[-1,-1,1,-1,-1,1,1,1];return new oe(this.context.device,{...this.getShaders(),id:this.props.id,bufferLayout:this.getAttributeManager().getBufferLayouts(),geometry:new xe({topology:"triangle-strip",attributes:{positions:{size:2,value:new Float32Array(e)}}}),isInstanced:!0})}_onUpdate(e){e?(this.getAttributeManager()?.invalidate("getIcon"),this.setNeedsUpdate()):this.setNeedsRedraw()}_onError(e){const t=this.getCurrentLayer()?.props.onIconError;t?t(e):Z.error(e.error.message)()}getInstanceIconDef(e){const{x:t,y:i,width:s,height:n,mask:r,anchorX:a=s/2,anchorY:c=n/2}=this.state.iconManager.getIconMapping(e);return[s/2-a,n/2-c,t,i,s,n,r?1:0]}}_e.defaultProps=fi;_e.layerName="IconLayer";const dt={CLOCKWISE:1,COUNTER_CLOCKWISE:-1};function ht(o,e,t={}){return pi(o,t)!==e?(hi(o,t),!0):!1}function pi(o,e={}){return Math.sign(di(o,e))}const He={x:0,y:1,z:2};function di(o,e={}){const{start:t=0,end:i=o.length,plane:s="xy"}=e,n=e.size||2;let r=0;const a=He[s[0]],c=He[s[1]];for(let f=t,p=i-n;f<i;f+=n)r+=(o[f+a]-o[p+a])*(o[f+c]+o[p+c]),p=f;return r/2}function hi(o,e){const{start:t=0,end:i=o.length,size:s=2}=e,n=(i-t)/s,r=Math.floor(n/2);for(let a=0;a<r;++a){const c=t+a*s,f=t+(n-1-a)*s;for(let p=0;p<s;++p){const x=o[c+p];o[c+p]=o[f+p],o[f+p]=x}}}var le={exports:{}},je;function xi(){if(je)return le.exports;je=1,le.exports=o,le.exports.default=o;function o(l,u,g){g=g||2;var d=u&&u.length,h=d?u[0]*g:l.length,v=e(l,0,h,g,!0),y=[];if(!v||v.next===v.prev)return y;var _,P,L,D,F,T,H;if(d&&(v=c(l,u,v,g)),l.length>80*g){_=L=l[0],P=D=l[1];for(var B=g;B<h;B+=g)F=l[B],T=l[B+1],F<_&&(_=F),T<P&&(P=T),F>L&&(L=F),T>D&&(D=T);H=Math.max(L-_,D-P),H=H!==0?32767/H:0}return i(v,y,g,_,P,H,0),y}function e(l,u,g,d,h){var v,y;if(h===q(l,u,g,d)>0)for(v=u;v<g;v+=d)y=V(v,l[v],l[v+1],y);else for(v=g-d;v>=u;v-=d)y=V(v,l[v],l[v+1],y);return y&&w(y,y.next)&&($(y),y=y.next),y}function t(l,u){if(!l)return l;u||(u=l);var g=l,d;do if(d=!1,!g.steiner&&(w(g,g.next)||S(g.prev,g,g.next)===0)){if($(g),g=u=g.prev,g===g.next)break;d=!0}else g=g.next;while(d||g!==u);return u}function i(l,u,g,d,h,v,y){if(l){!y&&v&&C(l,d,h,v);for(var _=l,P,L;l.prev!==l.next;){if(P=l.prev,L=l.next,v?n(l,d,h,v):s(l)){u.push(P.i/g|0),u.push(l.i/g|0),u.push(L.i/g|0),$(l),l=L.next,_=L.next;continue}if(l=L,l===_){y?y===1?(l=r(t(l),u,g),i(l,u,g,d,h,v,2)):y===2&&a(l,u,g,d,h,v):i(t(l),u,g,d,h,v,1);break}}}}function s(l){var u=l.prev,g=l,d=l.next;if(S(u,g,d)>=0)return!1;for(var h=u.x,v=g.x,y=d.x,_=u.y,P=g.y,L=d.y,D=h<v?h<y?h:y:v<y?v:y,F=_<P?_<L?_:L:P<L?P:L,T=h>v?h>y?h:y:v>y?v:y,H=_>P?_>L?_:L:P>L?P:L,B=d.next;B!==u;){if(B.x>=D&&B.x<=T&&B.y>=F&&B.y<=H&&A(h,_,v,P,y,L,B.x,B.y)&&S(B.prev,B,B.next)>=0)return!1;B=B.next}return!0}function n(l,u,g,d){var h=l.prev,v=l,y=l.next;if(S(h,v,y)>=0)return!1;for(var _=h.x,P=v.x,L=y.x,D=h.y,F=v.y,T=y.y,H=_<P?_<L?_:L:P<L?P:L,B=D<F?D<T?D:T:F<T?F:T,Q=_>P?_>L?_:L:P>L?P:L,ee=D>F?D>T?D:T:F>T?F:T,Fe=O(H,B,u,g,d),Be=O(Q,ee,u,g,d),M=l.prevZ,I=l.nextZ;M&&M.z>=Fe&&I&&I.z<=Be;){if(M.x>=H&&M.x<=Q&&M.y>=B&&M.y<=ee&&M!==h&&M!==y&&A(_,D,P,F,L,T,M.x,M.y)&&S(M.prev,M,M.next)>=0||(M=M.prevZ,I.x>=H&&I.x<=Q&&I.y>=B&&I.y<=ee&&I!==h&&I!==y&&A(_,D,P,F,L,T,I.x,I.y)&&S(I.prev,I,I.next)>=0))return!1;I=I.nextZ}for(;M&&M.z>=Fe;){if(M.x>=H&&M.x<=Q&&M.y>=B&&M.y<=ee&&M!==h&&M!==y&&A(_,D,P,F,L,T,M.x,M.y)&&S(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;I&&I.z<=Be;){if(I.x>=H&&I.x<=Q&&I.y>=B&&I.y<=ee&&I!==h&&I!==y&&A(_,D,P,F,L,T,I.x,I.y)&&S(I.prev,I,I.next)>=0)return!1;I=I.nextZ}return!0}function r(l,u,g){var d=l;do{var h=d.prev,v=d.next.next;!w(h,v)&&E(h,d,d.next,v)&&R(h,v)&&R(v,h)&&(u.push(h.i/g|0),u.push(d.i/g|0),u.push(v.i/g|0),$(d),$(d.next),d=l=v),d=d.next}while(d!==l);return t(d)}function a(l,u,g,d,h,v){var y=l;do{for(var _=y.next.next;_!==y.prev;){if(y.i!==_.i&&N(y,_)){var P=j(y,_);y=t(y,y.next),P=t(P,P.next),i(y,u,g,d,h,v,0),i(P,u,g,d,h,v,0);return}_=_.next}y=y.next}while(y!==l)}function c(l,u,g,d){var h=[],v,y,_,P,L;for(v=0,y=u.length;v<y;v++)_=u[v]*d,P=v<y-1?u[v+1]*d:l.length,L=e(l,_,P,d,!1),L===L.next&&(L.steiner=!0),h.push(z(L));for(h.sort(f),v=0;v<h.length;v++)g=p(h[v],g);return g}function f(l,u){return l.x-u.x}function p(l,u){var g=x(l,u);if(!g)return u;var d=j(g,l);return t(d,d.next),t(g,g.next)}function x(l,u){var g=u,d=l.x,h=l.y,v=-1/0,y;do{if(h<=g.y&&h>=g.next.y&&g.next.y!==g.y){var _=g.x+(h-g.y)*(g.next.x-g.x)/(g.next.y-g.y);if(_<=d&&_>v&&(v=_,y=g.x<g.next.x?g:g.next,_===d))return y}g=g.next}while(g!==u);if(!y)return null;var P=y,L=y.x,D=y.y,F=1/0,T;g=y;do d>=g.x&&g.x>=L&&d!==g.x&&A(h<D?d:v,h,L,D,h<D?v:d,h,g.x,g.y)&&(T=Math.abs(h-g.y)/(d-g.x),R(g,l)&&(T<F||T===F&&(g.x>y.x||g.x===y.x&&m(y,g)))&&(y=g,F=T)),g=g.next;while(g!==P);return y}function m(l,u){return S(l.prev,l,u.prev)<0&&S(u.next,l,l.next)<0}function C(l,u,g,d){var h=l;do h.z===0&&(h.z=O(h.x,h.y,u,g,d)),h.prevZ=h.prev,h.nextZ=h.next,h=h.next;while(h!==l);h.prevZ.nextZ=null,h.prevZ=null,b(h)}function b(l){var u,g,d,h,v,y,_,P,L=1;do{for(g=l,l=null,v=null,y=0;g;){for(y++,d=g,_=0,u=0;u<L&&(_++,d=d.nextZ,!!d);u++);for(P=L;_>0||P>0&&d;)_!==0&&(P===0||!d||g.z<=d.z)?(h=g,g=g.nextZ,_--):(h=d,d=d.nextZ,P--),v?v.nextZ=h:l=h,h.prevZ=v,v=h;g=d}v.nextZ=null,L*=2}while(y>1);return l}function O(l,u,g,d,h){return l=(l-g)*h|0,u=(u-d)*h|0,l=(l|l<<8)&16711935,l=(l|l<<4)&252645135,l=(l|l<<2)&858993459,l=(l|l<<1)&1431655765,u=(u|u<<8)&16711935,u=(u|u<<4)&252645135,u=(u|u<<2)&858993459,u=(u|u<<1)&1431655765,l|u<<1}function z(l){var u=l,g=l;do(u.x<g.x||u.x===g.x&&u.y<g.y)&&(g=u),u=u.next;while(u!==l);return g}function A(l,u,g,d,h,v,y,_){return(h-y)*(u-_)>=(l-y)*(v-_)&&(l-y)*(d-_)>=(g-y)*(u-_)&&(g-y)*(v-_)>=(h-y)*(d-_)}function N(l,u){return l.next.i!==u.i&&l.prev.i!==u.i&&!U(l,u)&&(R(l,u)&&R(u,l)&&W(l,u)&&(S(l.prev,l,u.prev)||S(l,u.prev,u))||w(l,u)&&S(l.prev,l,l.next)>0&&S(u.prev,u,u.next)>0)}function S(l,u,g){return(u.y-l.y)*(g.x-u.x)-(u.x-l.x)*(g.y-u.y)}function w(l,u){return l.x===u.x&&l.y===u.y}function E(l,u,g,d){var h=G(S(l,u,g)),v=G(S(l,u,d)),y=G(S(g,d,l)),_=G(S(g,d,u));return!!(h!==v&&y!==_||h===0&&k(l,g,u)||v===0&&k(l,d,u)||y===0&&k(g,l,d)||_===0&&k(g,u,d))}function k(l,u,g){return u.x<=Math.max(l.x,g.x)&&u.x>=Math.min(l.x,g.x)&&u.y<=Math.max(l.y,g.y)&&u.y>=Math.min(l.y,g.y)}function G(l){return l>0?1:l<0?-1:0}function U(l,u){var g=l;do{if(g.i!==l.i&&g.next.i!==l.i&&g.i!==u.i&&g.next.i!==u.i&&E(g,g.next,l,u))return!0;g=g.next}while(g!==l);return!1}function R(l,u){return S(l.prev,l,l.next)<0?S(l,u,l.next)>=0&&S(l,l.prev,u)>=0:S(l,u,l.prev)<0||S(l,l.next,u)<0}function W(l,u){var g=l,d=!1,h=(l.x+u.x)/2,v=(l.y+u.y)/2;do g.y>v!=g.next.y>v&&g.next.y!==g.y&&h<(g.next.x-g.x)*(v-g.y)/(g.next.y-g.y)+g.x&&(d=!d),g=g.next;while(g!==l);return d}function j(l,u){var g=new Y(l.i,l.x,l.y),d=new Y(u.i,u.x,u.y),h=l.next,v=u.prev;return l.next=u,u.prev=l,g.next=h,h.prev=g,d.next=g,g.prev=d,v.next=d,d.prev=v,d}function V(l,u,g,d){var h=new Y(l,u,g);return d?(h.next=d.next,h.prev=d,d.next.prev=h,d.next=h):(h.prev=h,h.next=h),h}function $(l){l.next.prev=l.prev,l.prev.next=l.next,l.prevZ&&(l.prevZ.nextZ=l.nextZ),l.nextZ&&(l.nextZ.prevZ=l.prevZ)}function Y(l,u,g){this.i=l,this.x=u,this.y=g,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}o.deviation=function(l,u,g,d){var h=u&&u.length,v=h?u[0]*g:l.length,y=Math.abs(q(l,0,v,g));if(h)for(var _=0,P=u.length;_<P;_++){var L=u[_]*g,D=_<P-1?u[_+1]*g:l.length;y-=Math.abs(q(l,L,D,g))}var F=0;for(_=0;_<d.length;_+=3){var T=d[_]*g,H=d[_+1]*g,B=d[_+2]*g;F+=Math.abs((l[T]-l[B])*(l[H+1]-l[T+1])-(l[T]-l[H])*(l[B+1]-l[T+1]))}return y===0&&F===0?0:Math.abs((F-y)/y)};function q(l,u,g,d){for(var h=0,v=u,y=g-d;v<g;v+=d)h+=(l[y]-l[v])*(l[v+1]+l[y+1]),y=v;return h}return o.flatten=function(l){for(var u=l[0][0].length,g={vertices:[],holes:[],dimensions:u},d=0,h=0;h<l.length;h++){for(var v=0;v<l[h].length;v++)for(var y=0;y<u;y++)g.vertices.push(l[h][v][y]);h>0&&(d+=l[h-1].length,g.holes.push(d))}return g},le.exports}var vi=xi();const yi=kt(vi),ce=dt.CLOCKWISE,Ve=dt.COUNTER_CLOCKWISE,K={};function mi(o){if(o=o&&o.positions||o,!Array.isArray(o)&&!ArrayBuffer.isView(o))throw new Error("invalid polygon")}function ie(o){return"positions"in o?o.positions:o}function pe(o){return"holeIndices"in o?o.holeIndices:null}function _i(o){return Array.isArray(o[0])}function Ci(o){return o.length>=1&&o[0].length>=2&&Number.isFinite(o[0][0])}function Li(o){const e=o[0],t=o[o.length-1];return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]}function Pi(o,e,t,i){for(let s=0;s<e;s++)if(o[t+s]!==o[i-e+s])return!1;return!0}function $e(o,e,t,i,s){let n=e;const r=t.length;for(let a=0;a<r;a++)for(let c=0;c<i;c++)o[n++]=t[a][c]||0;if(!Li(t))for(let a=0;a<i;a++)o[n++]=t[0][a]||0;return K.start=e,K.end=n,K.size=i,ht(o,s,K),n}function Ze(o,e,t,i,s=0,n,r){n=n||t.length;const a=n-s;if(a<=0)return e;let c=e;for(let f=0;f<a;f++)o[c++]=t[s+f];if(!Pi(t,i,s,n))for(let f=0;f<i;f++)o[c++]=t[s+f];return K.start=e,K.end=c,K.size=i,ht(o,r,K),c}function Si(o,e){mi(o);const t=[],i=[];if("positions"in o){const{positions:s,holeIndices:n}=o;if(n){let r=0;for(let a=0;a<=n.length;a++)r=Ze(t,r,s,e,n[a-1],n[a],a===0?ce:Ve),i.push(r);return i.pop(),{positions:t,holeIndices:i}}o=s}if(!_i(o))return Ze(t,0,o,e,0,t.length,ce),t;if(!Ci(o)){let s=0;for(const[n,r]of o.entries())s=$e(t,s,r,e,n===0?ce:Ve),i.push(s);return i.pop(),{positions:t,holeIndices:i}}return $e(t,0,o,e,ce),t}function Ce(o,e,t){const i=o.length/3;let s=0;for(let n=0;n<i;n++){const r=(n+1)%i;s+=o[n*3+e]*o[r*3+t],s-=o[r*3+e]*o[n*3+t]}return Math.abs(s/2)}function Ke(o,e,t,i){const s=o.length/3;for(let n=0;n<s;n++){const r=n*3,a=o[r+0],c=o[r+1],f=o[r+2];o[r+e]=a,o[r+t]=c,o[r+i]=f}}function bi(o,e,t,i){let s=pe(o);s&&(s=s.map(a=>a/e));let n=ie(o);const r=i&&e===3;if(t){const a=n.length;n=n.slice();const c=[];for(let f=0;f<a;f+=e){c[0]=n[f],c[1]=n[f+1],r&&(c[2]=n[f+2]);const p=t(c);n[f]=p[0],n[f+1]=p[1],r&&(n[f+2]=p[2])}}if(r){const a=Ce(n,0,1),c=Ce(n,0,2),f=Ce(n,1,2);if(!a&&!c&&!f)return[];a>c&&a>f||(c>f?(t||(n=n.slice()),Ke(n,0,2,1)):(t||(n=n.slice()),Ke(n,2,0,1)))}return yi(n,s,e)}class wi extends Ot{constructor(e){const{fp64:t,IndexType:i=Uint32Array}=e;super({...e,attributes:{positions:{size:3,type:t?Float64Array:Float32Array},vertexValid:{type:Uint16Array,size:1},indices:{type:i,size:1}}})}get(e){const{attributes:t}=this;return e==="indices"?t.indices&&t.indices.subarray(0,this.vertexCount):t[e]}updateGeometry(e){super.updateGeometry(e);const t=this.buffers.indices;if(t)this.vertexCount=(t.value||t).length;else if(this.data&&!this.getGeometry)throw new Error("missing indices buffer")}normalizeGeometry(e){if(this.normalize){const t=Si(e,this.positionSize);return this.opts.resolution?Et(ie(t),pe(t),{size:this.positionSize,gridResolution:this.opts.resolution,edgeTypes:!0}):this.opts.wrapLongitude?Rt(ie(t),pe(t),{size:this.positionSize,maxLatitude:86,edgeTypes:!0}):t}return e}getGeometrySize(e){if(Ye(e)){let t=0;for(const i of e)t+=this.getGeometrySize(i);return t}return ie(e).length/this.positionSize}getGeometryFromBuffer(e){return this.normalize||!this.buffers.indices?super.getGeometryFromBuffer(e):null}updateGeometryAttributes(e,t){if(e&&Ye(e))for(const i of e){const s=this.getGeometrySize(i);t.geometrySize=s,this.updateGeometryAttributes(i,t),t.vertexStart+=s,t.indexStart=this.indexStarts[t.geometryIndex+1]}else{const i=e;this._updateIndices(i,t),this._updatePositions(i,t),this._updateVertexValid(i,t)}}_updateIndices(e,{geometryIndex:t,vertexStart:i,indexStart:s}){const{attributes:n,indexStarts:r,typedArrayManager:a}=this;let c=n.indices;if(!c||!e)return;let f=s;const p=bi(e,this.positionSize,this.opts.preproject,this.opts.full3d);c=a.allocate(c,s+p.length,{copy:!0});for(let x=0;x<p.length;x++)c[f++]=p[x]+i;r[t+1]=s+p.length,n.indices=c}_updatePositions(e,{vertexStart:t,geometrySize:i}){const{attributes:{positions:s},positionSize:n}=this;if(!s||!e)return;const r=ie(e);for(let a=t,c=0;c<i;a++,c++){const f=r[c*n],p=r[c*n+1],x=n>2?r[c*n+2]:0;s[a*3]=f,s[a*3+1]=p,s[a*3+2]=x}}_updateVertexValid(e,{vertexStart:t,geometrySize:i}){const{positionSize:s}=this,n=this.attributes.vertexValid,r=e&&pe(e);if(e&&e.edgeTypes?n.set(e.edgeTypes,t):n.fill(1,t,t+i),r)for(let a=0;a<r.length;a++)n[t+r[a]/s-1]=0;n[t+i-1]=0}}function Ye(o){return Array.isArray(o)&&o.length>0&&!Number.isFinite(o[0])}const Xe=`layout(std140) uniform solidPolygonUniforms {
  bool extruded;
  bool isWireframe;
  float elevationScale;
} solidPolygon;
`,zi={name:"solidPolygon",vs:Xe,fs:Xe,uniformTypes:{extruded:"f32",isWireframe:"f32",elevationScale:"f32"}},xt=`in vec4 fillColors;
in vec4 lineColors;
in vec3 pickingColors;
out vec4 vColor;
struct PolygonProps {
vec3 positions;
vec3 positions64Low;
vec3 normal;
float elevations;
};
vec3 project_offset_normal(vec3 vector) {
if (project.coordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
project.coordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSETS) {
return normalize(vector * project.commonUnitsPerWorldUnit);
}
return project_normal(vector);
}
void calculatePosition(PolygonProps props) {
vec3 pos = props.positions;
vec3 pos64Low = props.positions64Low;
vec3 normal = props.normal;
vec4 colors = solidPolygon.isWireframe ? lineColors : fillColors;
geometry.worldPosition = props.positions;
geometry.pickingColor = pickingColors;
if (solidPolygon.extruded) {
pos.z += props.elevations * solidPolygon.elevationScale;
}
gl_Position = project_position_to_clipspace(pos, pos64Low, vec3(0.), geometry.position);
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
if (solidPolygon.extruded) {
#ifdef IS_SIDE_VERTEX
normal = project_offset_normal(normal);
#else
normal = project_normal(normal);
#endif
geometry.normal = normal;
vec3 lightColor = lighting_getLightColor(colors.rgb, project.cameraPosition, geometry.position.xyz, geometry.normal);
vColor = vec4(lightColor, colors.a * layer.opacity);
} else {
vColor = vec4(colors.rgb, colors.a * layer.opacity);
}
DECKGL_FILTER_COLOR(vColor, geometry);
}
`,Ai=`#version 300 es
#define SHADER_NAME solid-polygon-layer-vertex-shader
in vec3 vertexPositions;
in vec3 vertexPositions64Low;
in float elevations;
${xt}
void main(void) {
PolygonProps props;
props.positions = vertexPositions;
props.positions64Low = vertexPositions64Low;
props.elevations = elevations;
props.normal = vec3(0.0, 0.0, 1.0);
calculatePosition(props);
}
`,Ti=`#version 300 es
#define SHADER_NAME solid-polygon-layer-vertex-shader-side
#define IS_SIDE_VERTEX
in vec2 positions;
in vec3 vertexPositions;
in vec3 nextVertexPositions;
in vec3 vertexPositions64Low;
in vec3 nextVertexPositions64Low;
in float elevations;
in float instanceVertexValid;
${xt}
void main(void) {
if(instanceVertexValid < 0.5){
gl_Position = vec4(0.);
return;
}
PolygonProps props;
vec3 pos;
vec3 pos64Low;
vec3 nextPos;
vec3 nextPos64Low;
#if RING_WINDING_ORDER_CW == 1
pos = vertexPositions;
pos64Low = vertexPositions64Low;
nextPos = nextVertexPositions;
nextPos64Low = nextVertexPositions64Low;
#else
pos = nextVertexPositions;
pos64Low = nextVertexPositions64Low;
nextPos = vertexPositions;
nextPos64Low = vertexPositions64Low;
#endif
props.positions = mix(pos, nextPos, positions.x);
props.positions64Low = mix(pos64Low, nextPos64Low, positions.x);
props.normal = vec3(
pos.y - nextPos.y + (pos64Low.y - nextPos64Low.y),
nextPos.x - pos.x + (nextPos64Low.x - pos64Low.x),
0.0);
props.elevations = elevations * positions.y;
calculatePosition(props);
}
`,Mi=`#version 300 es
#define SHADER_NAME solid-polygon-layer-fragment-shader
precision highp float;
in vec4 vColor;
out vec4 fragColor;
void main(void) {
fragColor = vColor;
geometry.uv = vec2(0.);
DECKGL_FILTER_COLOR(fragColor, geometry);
}
`,ve=[0,0,0,255],Ii={filled:!0,extruded:!1,wireframe:!1,_normalize:!0,_windingOrder:"CW",_full3d:!1,elevationScale:{type:"number",min:0,value:1},getPolygon:{type:"accessor",value:o=>o.polygon},getElevation:{type:"accessor",value:1e3},getFillColor:{type:"accessor",value:ve},getLineColor:{type:"accessor",value:ve},material:!0},ge={enter:(o,e)=>e.length?e.subarray(e.length-o.length):o};class Me extends me{getShaders(e){return super.getShaders({vs:e==="top"?Ai:Ti,fs:Mi,defines:{RING_WINDING_ORDER_CW:!this.props._normalize&&this.props._windingOrder==="CCW"?0:1},modules:[ze,ut,Ae,zi]})}get wrapLongitude(){return!1}getBounds(){return this.getAttributeManager()?.getBounds(["vertexPositions"])}initializeState(){const{viewport:e}=this.context;let{coordinateSystem:t}=this.props;const{_full3d:i}=this.props;e.isGeospatial&&t==="default"&&(t="lnglat");let s;t==="lnglat"&&(i?s=e.projectPosition.bind(e):s=e.projectFlat.bind(e)),this.setState({numInstances:0,polygonTesselator:new wi({preproject:s,fp64:this.use64bitPositions(),IndexType:Uint32Array})});const n=this.getAttributeManager(),r=!0;n.remove(["instancePickingColors"]),n.add({indices:{size:1,isIndexed:!0,update:this.calculateIndices,noAlloc:r},vertexPositions:{size:3,type:"float64",stepMode:"dynamic",fp64:this.use64bitPositions(),transition:ge,accessor:"getPolygon",update:this.calculatePositions,noAlloc:r,shaderAttributes:{nextVertexPositions:{vertexOffset:1}}},instanceVertexValid:{size:1,type:"uint16",stepMode:"instance",update:this.calculateVertexValid,noAlloc:r},elevations:{size:1,stepMode:"dynamic",transition:ge,accessor:"getElevation"},fillColors:{size:this.props.colorFormat.length,type:"unorm8",stepMode:"dynamic",transition:ge,accessor:"getFillColor",defaultValue:ve},lineColors:{size:this.props.colorFormat.length,type:"unorm8",stepMode:"dynamic",transition:ge,accessor:"getLineColor",defaultValue:ve},pickingColors:{size:4,type:"uint8",stepMode:"dynamic",accessor:(a,{index:c,target:f})=>this.encodePickingColor(a&&a.__source?a.__source.index:c,f)}})}getPickingInfo(e){const t=super.getPickingInfo(e),{index:i}=t,s=this.props.data;return s[0]&&s[0].__source&&(t.object=s.find(n=>n.__source.index===i)),t}disablePickingIndex(e){const t=this.props.data;if(t[0]&&t[0].__source)for(let i=0;i<t.length;i++)t[i].__source.index===e&&this._disablePickingIndex(i);else super.disablePickingIndex(e)}draw({uniforms:e}){const{extruded:t,filled:i,wireframe:s,elevationScale:n}=this.props,{topModel:r,sideModel:a,wireframeModel:c,polygonTesselator:f}=this.state,p={extruded:!!t,elevationScale:n,isWireframe:!1};c&&s&&(c.setInstanceCount(f.instanceCount-1),c.shaderInputs.setProps({solidPolygon:{...p,isWireframe:!0}}),c.draw(this.context.renderPass)),a&&i&&(a.setInstanceCount(f.instanceCount-1),a.shaderInputs.setProps({solidPolygon:p}),a.draw(this.context.renderPass)),r&&i&&(r.setVertexCount(f.vertexCount),r.shaderInputs.setProps({solidPolygon:p}),r.draw(this.context.renderPass))}updateState(e){super.updateState(e),this.updateGeometry(e);const{props:t,oldProps:i,changeFlags:s}=e,n=this.getAttributeManager();(s.extensionsChanged||t.filled!==i.filled||t.extruded!==i.extruded)&&(this.state.models?.forEach(a=>a.destroy()),this.setState(this._getModels()),n.invalidateAll())}updateGeometry({props:e,oldProps:t,changeFlags:i}){if(i.dataChanged||i.updateTriggersChanged&&(i.updateTriggersChanged.all||i.updateTriggersChanged.getPolygon)){const{polygonTesselator:n}=this.state,r=e.data.attributes||{};n.updateGeometry({data:e.data,normalize:e._normalize,geometryBuffer:r.getPolygon,buffers:r,getGeometry:e.getPolygon,positionFormat:e.positionFormat,wrapLongitude:e.wrapLongitude,resolution:this.context.viewport.resolution,fp64:this.use64bitPositions(),dataChanged:i.dataChanged,full3d:e._full3d}),this.setState({numInstances:n.instanceCount,startIndices:n.vertexStarts}),i.dataChanged||this.getAttributeManager().invalidateAll()}}_getModels(){const{id:e,filled:t,extruded:i}=this.props;let s,n,r;if(t){const a=this.getShaders("top");a.defines.NON_INSTANCED_MODEL=1;const c=this.getAttributeManager().getBufferLayouts({isInstanced:!1});s=new oe(this.context.device,{...a,id:`${e}-top`,topology:"triangle-list",bufferLayout:c,isIndexed:!0,userData:{excludeAttributes:{instanceVertexValid:!0}}})}if(i){const a=this.getAttributeManager().getBufferLayouts({isInstanced:!0});n=new oe(this.context.device,{...this.getShaders("side"),id:`${e}-side`,bufferLayout:a,geometry:new xe({topology:"triangle-strip",attributes:{positions:{size:2,value:new Float32Array([1,0,0,0,1,1,0,1])}}}),isInstanced:!0,userData:{excludeAttributes:{indices:!0}}}),r=new oe(this.context.device,{...this.getShaders("side"),id:`${e}-wireframe`,bufferLayout:a,geometry:new xe({topology:"line-strip",attributes:{positions:{size:2,value:new Float32Array([1,0,0,0,0,1,1,1])}}}),isInstanced:!0,userData:{excludeAttributes:{indices:!0}}})}return{models:[n,r,s].filter(Boolean),topModel:s,sideModel:n,wireframeModel:r}}calculateIndices(e){const{polygonTesselator:t}=this.state;e.startIndices=t.indexStarts,e.value=t.get("indices")}calculatePositions(e){const{polygonTesselator:t}=this.state;e.startIndices=t.vertexStarts,e.value=t.get("positions")}calculateVertexValid(e){e.value=this.state.polygonTesselator.get("vertexValid")}}Me.defaultProps=Ii;Me.layerName="SolidPolygonLayer";function Oi({data:o,getIndex:e,dataRange:t,replace:i}){const{startRow:s=0,endRow:n=1/0}=t,r=o.length;let a=r,c=r;for(let m=0;m<r;m++){const C=e(o[m]);if(a>m&&C>=s&&(a=m),C>=n){c=m;break}}let f=a;const x=c-a!==i.length?o.slice(c):void 0;for(let m=0;m<i.length;m++)o[f++]=i[m];if(x){for(let m=0;m<x.length;m++)o[f++]=x[m];o.length=f}return{startRow:a,endRow:a+i.length}}function Ei(o,e){if(!o)return null;const t="startIndices"in o?o.startIndices[e]:e,i=o.featureIds.value[t];return t!==-1?Ri(o,i,t):null}function Ri(o,e,t){const i={properties:{...o.properties[e]}};for(const s in o.numericProps)i.properties[s]=o.numericProps[s].value[t];return i}function Fi(o,e){const t={points:null,lines:null,polygons:null};for(const i in t){const s=o[i].globalFeatureIds.value;t[i]=new Uint8ClampedArray(s.length*4);const n=[];for(let r=0;r<s.length;r++)e(s[r],n),t[i][r*4+0]=n[0],t[i][r*4+1]=n[1],t[i][r*4+2]=n[2],t[i][r*4+3]=255}return t}const Je=`layout(std140) uniform sdfUniforms {
  float gamma;
  bool enabled;
  float buffer;
  float outlineBuffer;
  vec4 outlineColor;
} sdf;
`,Bi={name:"sdf",vs:Je,fs:Je,uniformTypes:{gamma:"f32",enabled:"f32",buffer:"f32",outlineBuffer:"f32",outlineColor:"vec4<f32>"}},ne={none:0,start:1,center:2,end:3},ki=`layout(std140) uniform textUniforms {
  highp vec2 cutoffPixels;
  highp ivec2 align;
  highp float fontSize;
  bool flipY;
} text;

#define ALIGN_MODE_START ${ne.start}
#define ALIGN_MODE_CENTER ${ne.center}
#define ALIGN_MODE_END ${ne.end}
`,vt={name:"text",vs:ki,getUniforms:({contentCutoffPixels:o=[0,0],contentAlignHorizontal:e="none",contentAlignVertical:t="none",fontSize:i,viewport:s})=>({cutoffPixels:o,align:[ne[e],ne[t]],fontSize:i,flipY:s?.flipY??!1}),uniformTypes:{cutoffPixels:"vec2<f32>",align:"vec2<i32>",fontSize:"f32",flipY:"f32"}},Di=`#version 300 es
#define SHADER_NAME multi-icon-layer-vertex-shader
in vec2 positions;
in vec3 instancePositions;
in vec3 instancePositions64Low;
in float instanceSizes;
in float instanceAngles;
in vec4 instanceColors;
in vec3 instancePickingColors;
in vec4 instanceIconFrames;
in float instanceColorModes;
in vec2 instanceOffsets;
in vec2 instancePixelOffset;
in vec4 instanceClipRect;
out float vColorMode;
out vec4 vColor;
out vec2 vTextureCoords;
out vec2 uv;
vec2 rotate_by_angle(vec2 vertex, float angle) {
float angle_radian = angle * PI / 180.0;
float cos_angle = cos(angle_radian);
float sin_angle = sin(angle_radian);
mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
return rotationMatrix * vertex;
}
float getPixelOffsetFromAlignment(float anchor, float extent, float clipStart, float clipEnd, int mode) {
if (clipEnd < clipStart) return 0.0;
if (mode == ALIGN_MODE_START) {
return max(- (anchor + clipStart), 0.0);
}
if (mode == ALIGN_MODE_CENTER) {
float _min = max(0., anchor + clipStart);
float _max = min(extent, anchor + clipEnd);
return _min < _max ? (_min + _max) / 2.0 - anchor : 0.0;
}
if (mode == ALIGN_MODE_END) {
return min(extent - (anchor + clipEnd), 0.);
}
return 0.0;
}
void main(void) {
geometry.worldPosition = instancePositions;
geometry.uv = positions;
geometry.pickingColor = instancePickingColors;
uv = positions;
vec2 iconSize = instanceIconFrames.zw;
float sizePixels = clamp(
project_size_to_pixel(instanceSizes * icon.sizeScale, icon.sizeUnits),
icon.sizeMinPixels, icon.sizeMaxPixels
);
float instanceScale = sizePixels / text.fontSize;
vec2 pixelOffset = positions / 2.0 * iconSize + instanceOffsets;
pixelOffset = rotate_by_angle(pixelOffset, instanceAngles) * instanceScale;
pixelOffset += instancePixelOffset;
pixelOffset.y *= -1.0;
vec2 anchorPosScreen;
if (icon.billboard)  {
gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
anchorPosScreen = gl_Position.xy / gl_Position.w;
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
vec3 offset = vec3(pixelOffset, 0.0);
DECKGL_FILTER_SIZE(offset, geometry);
gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
} else {
vec3 offset_common = vec3(project_pixel_size(pixelOffset), 0.0);
if (text.flipY) {
offset_common.y *= -1.;
}
DECKGL_FILTER_SIZE(offset_common, geometry);
vec4 anchorPos = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0));
anchorPosScreen = anchorPos.xy / anchorPos.w;
gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset_common, geometry.position);
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
}
anchorPosScreen = vec2(anchorPosScreen.x + 1.0, 1.0 - anchorPosScreen.y) / 2.0 * project.viewportSize / project.devicePixelRatio;
vec2 xy = project_size_to_pixel(instanceClipRect.xy);
vec2 wh = project_size_to_pixel(instanceClipRect.zw);
if (text.flipY) {
xy.y = -xy.y - wh.y;
}
if (text.align.x > 0 || text.align.y > 0) {
vec2 viewportPixels = project.viewportSize / project.devicePixelRatio;
vec2 scrollPixels = vec2(
getPixelOffsetFromAlignment(anchorPosScreen.x, viewportPixels.x, xy.x, xy.x + wh.x, text.align.x),
-getPixelOffsetFromAlignment(anchorPosScreen.y, viewportPixels.y, -xy.y - wh.y, -xy.y, text.align.y)
);
pixelOffset += scrollPixels;
gl_Position.xy += project_pixel_size_to_clipspace(scrollPixels);
}
if (instanceClipRect.z >= 0.) {
if (pixelOffset.x < xy.x || pixelOffset.x > xy.x + wh.x) {
gl_Position = vec4(0.0);
}
else if (text.cutoffPixels.x > 0.) {
float vpWidth = project.viewportSize.x / project.devicePixelRatio;
float l = max(anchorPosScreen.x + xy.x, 0.0);
float r = min(anchorPosScreen.x + xy.x + wh.x, vpWidth);
if (r - l < text.cutoffPixels.x) {
gl_Position = vec4(0.0);
}
}
}
if (instanceClipRect.w >= 0.) {
if (pixelOffset.y < xy.y || pixelOffset.y > xy.y + wh.y) {
gl_Position = vec4(0.0);
}
else if (text.cutoffPixels.y > 0.) {
float vpHeight = project.viewportSize.y / project.devicePixelRatio;
float t = max(anchorPosScreen.y - xy.y - wh.y, 0.0);
float b = min(anchorPosScreen.y - xy.y, vpHeight);
if (b - t < text.cutoffPixels.y) {
gl_Position = vec4(0.0);
}
}
}
vTextureCoords = mix(
instanceIconFrames.xy,
instanceIconFrames.xy + iconSize,
(positions.xy + 1.0) / 2.0
) / icon.iconsTextureDim;
vColor = instanceColors;
DECKGL_FILTER_COLOR(vColor, geometry);
vColorMode = instanceColorModes;
}
`,Ni=`#version 300 es
#define SHADER_NAME multi-icon-layer-fragment-shader
precision highp float;
uniform sampler2D iconsTexture;
in vec4 vColor;
in vec2 vTextureCoords;
in vec2 uv;
out vec4 fragColor;
void main(void) {
geometry.uv = uv;
if (!bool(picking.isActive)) {
float alpha = texture(iconsTexture, vTextureCoords).a;
vec4 color = vColor;
if (sdf.enabled) {
float distance = alpha;
alpha = smoothstep(sdf.buffer - sdf.gamma, sdf.buffer + sdf.gamma, distance);
if (sdf.outlineBuffer > 0.0) {
float inFill = alpha;
float inBorder = smoothstep(sdf.outlineBuffer - sdf.gamma, sdf.outlineBuffer + sdf.gamma, distance);
color = mix(sdf.outlineColor, vColor, inFill);
alpha = inBorder;
}
}
float a = alpha * color.a;
if (a < icon.alphaCutoff) {
discard;
}
fragColor = vec4(color.rgb, a * layer.opacity);
}
DECKGL_FILTER_COLOR(fragColor, geometry);
}
`,Le=192/256,Gi={getIconOffsets:{type:"accessor",value:o=>o.offsets},getContentBox:{type:"accessor",value:[0,0,-1,-1]},fontSize:1,alphaCutoff:.001,smoothing:.1,outlineWidth:0,outlineColor:{type:"color",value:[0,0,0,255]},contentCutoffPixels:{type:"array",value:[0,0]},contentAlignHorizontal:"none",contentAlignVertical:"none"};class Ie extends _e{getShaders(){const e=super.getShaders();return{...e,modules:[...e.modules,vt,Bi],vs:Di,fs:Ni}}initializeState(){super.initializeState();const e=this.getAttributeManager(),t=e.attributes.instanceIconDefs;t.settings.update=this.calculateInstanceIconDefs,e.addInstanced({instancePickingColors:{type:"uint8",size:4,accessor:(i,{index:s,target:n})=>this.encodePickingColor(s,n)},instanceClipRect:{size:4,accessor:"getContentBox",defaultValue:[0,0,-1,-1]}})}updateState(e){super.updateState(e);const{props:t,oldProps:i,changeFlags:s}=e,{outlineColor:n}=t;if(s.updateTriggersChanged&&(s.updateTriggersChanged.getIcon||s.updateTriggersChanged.getIconOffsets)&&this.getAttributeManager().invalidate("instanceIconDefs"),n!==i.outlineColor){const r=[n[0]/255,n[1]/255,n[2]/255,(n[3]??255)/255];this.setState({outlineColor:r})}!t.sdf&&t.outlineWidth&&Z.warn(`${this.id}: fontSettings.sdf is required to render outline`)()}draw(e){const{sdf:t,smoothing:i,fontSize:s,outlineWidth:n,contentCutoffPixels:r,contentAlignHorizontal:a,contentAlignVertical:c}=this.props,{outlineColor:f}=this.state,p=n?Math.max(i,Le*(1-n)):-1,x=this.state.model,m={buffer:Le,outlineBuffer:p,gamma:i,enabled:!!t,outlineColor:f},C={contentCutoffPixels:r,contentAlignHorizontal:a,contentAlignVertical:c,fontSize:s,viewport:this.context.viewport};if(x.shaderInputs.setProps({sdf:m,text:C}),super.draw(e),t&&n){const{iconManager:b}=this.state;b.getTexture()&&(x.shaderInputs.setProps({sdf:{...m,outlineBuffer:Le}}),x.draw(this.context.renderPass))}}calculateInstanceIconDefs(e,{startRow:t,endRow:i}){const{data:s,getIcon:n,getIconOffsets:r}=this.props;let a=e.getVertexOffset(t);const c=e.value,{iterable:f,objectInfo:p}=we(s,t,i);for(const x of f){p.index++;const m=n(x,p),C=r(x,p);if(m){let b=0;for(const O of Array.from(m)){const z=super.getInstanceIconDef(O);z[0]=C[b*2],z[1]+=C[b*2+1],z[6]=1,c.set(z,a),a+=e.size,b++}}}}}Ie.defaultProps=Gi;Ie.layerName="MultiIconLayer";const se=1e20,Oe=new Float64Array(256);for(let o=0;o<256;o++){const e=.5-Math.pow(o/255,.45454545454545453);Oe[o]=e*Math.abs(e)}Oe[255]=-se;class Ui{constructor({fontSize:e=24,buffer:t=3,radius:i=8,cutoff:s=.25,fontFamily:n="sans-serif",fontWeight:r="normal",fontStyle:a="normal",lang:c=null}={}){this.buffer=t,this.radius=i,this.cutoff=s,this.lang=c;const f=this.size=e+t*4,p=this._createCanvas(f),x=this.ctx=p.getContext("2d",{willReadFrequently:!0});x.font=`${a} ${r} ${e}px ${n}`,x.textBaseline="alphabetic",x.textAlign="left",x.fillStyle="black",this.gridOuter=new Float64Array(f*f),this.gridInner=new Float64Array(f*f),this.f=new Float64Array(f),this.z=new Float64Array(f+1),this.v=new Uint16Array(f)}_createCanvas(e){if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(e,e);const t=document.createElement("canvas");return t.width=t.height=e,t}draw(e){const{width:t,actualBoundingBoxAscent:i,actualBoundingBoxDescent:s,actualBoundingBoxLeft:n,actualBoundingBoxRight:r}=this.ctx.measureText(e),a=Math.ceil(i),c=Math.floor(-n),f=Math.max(0,Math.min(this.size-this.buffer,Math.ceil(r)-c)),p=Math.max(0,Math.min(this.size-this.buffer,a+Math.ceil(s))),x=f+2*this.buffer,m=p+2*this.buffer,C=Math.max(x*m,0),b=new Uint8ClampedArray(C),O={data:b,width:x,height:m,glyphWidth:f,glyphHeight:p,glyphTop:a,glyphLeft:c,glyphAdvance:t};if(f===0||p===0)return O;const{ctx:z,buffer:A,gridInner:N,gridOuter:S}=this;this.lang&&(z.lang=this.lang),z.clearRect(A,A,f,p),z.fillText(e,A-c,A+a);const w=z.getImageData(A,A,f,p);S.fill(se,0,C),N.fill(0,0,C);let E=3;for(let R=0;R<p;R++){let W=(R+A)*x+A;for(let j=0;j<f;j++,E+=4,W++){const V=w.data[E];if(V===0)continue;const $=Oe[V];S[W]=Math.max(0,$),N[W]=Math.max(0,-$)}}qe(S,0,0,x,m,x,this.f,this.v,this.z);const k=Math.min(A,1);qe(N,A-k,A-k,f+2*k,p+2*k,x,this.f,this.v,this.z);const G=255/this.radius,U=255*(1-this.cutoff);for(let R=0;R<C;R++){const W=Math.sqrt(S[R])-Math.sqrt(N[R]);b[R]=Math.round(U-G*W)}return O}}function qe(o,e,t,i,s,n,r,a,c){for(let f=e;f<e+i;f++)Qe(o,t*n+f,n,s,r,a,c);for(let f=t;f<t+s;f++)Qe(o,f*n+e,1,i,r,a,c)}function Qe(o,e,t,i,s,n,r){n[0]=0,r[0]=-se,r[1]=se,s[0]=o[e];for(let a=1,c=0,f=0;a<i;a++){s[a]=o[e+a*t];const p=a*a;do{const x=n[c];f=(s[a]-s[x]+p-x*x)/(a-x)/2}while(f<=r[c]&&--c>-1);c++,n[c]=a,r[c]=f,r[c+1]=se}for(let a=0,c=0;a<i;a++){for(;r[c+1]<a;)c++;const f=n[c],p=a-f;o[e+a*t]=s[f]+p*p}}const Wi=32,Hi=[];function ji(o){return Math.pow(2,Math.ceil(Math.log2(o)))}function Vi({characterSet:o,measureText:e,buffer:t,maxCanvasWidth:i,mapping:s={},xOffset:n=0,yOffsetMin:r=0,yOffsetMax:a=0}){let c=n,f=r,p=a;for(const x of o)if(!s[x]){const{advance:m,width:C,ascent:b,descent:O}=e(x),z=b+O;c+C+t*2>i&&(c=0,f=p),s[x]={x:c+t,y:f+t,width:C,height:z,advance:m,anchorX:C/2,anchorY:b},c+=C+t*2,p=Math.max(p,f+z+t*2)}return{mapping:s,xOffset:c,yOffsetMin:f,yOffsetMax:p,canvasHeight:ji(p)}}function yt(o,e,t,i){let s=0;for(let n=e;n<t;n++){const r=o[n];s+=i[r]?.advance||0}return s}function mt(o,e,t,i,s,n){let r=e,a=0;for(let c=e;c<t;c++){const f=yt(o,c,c+1,s);a+f>i&&(r<c&&n.push(c),r=c,a=0),a+=f}return a}function $i(o,e,t,i,s,n){let r=e,a=e,c=e,f=0;for(let p=e;p<t;p++)if((o[p]===" "||o[p+1]===" "||p+1===t)&&(c=p+1),c>a){let x=yt(o,a,c,s);f+x>i&&(r<a&&(n.push(a),r=a,f=0),x>i&&(x=mt(o,a,c,i,s,n),r=n[n.length-1])),a=c,f+=x}return f}function Zi(o,e,t,i,s=0,n){n===void 0&&(n=o.length);const r=[];return e==="break-all"?mt(o,s,n,t,i,r):$i(o,s,n,t,i,r),r}function Ki(o,e,t,i,s,n){let r=0,a=0;for(let c=e;c<t;c++){const f=o[c],p=i[f];p&&(a=Math.max(a,p.height))}for(let c=e;c<t;c++){const f=o[c],p=i[f];p?(s[c]=r+p.anchorX,r+=p.advance):(Z.warn(`Missing character: ${f} (${f.codePointAt(0)})`)(),s[c]=r,r+=Wi)}n[0]=r,n[1]=a}function Yi(o,e,t,i,s,n){const r=Array.from(o),a=r.length,c=new Array(a),f=new Array(a),p=new Array(a),x=(i==="break-word"||i==="break-all")&&isFinite(s)&&s>0,m=[0,0],C=[0,0];let b=0,O=e+t/2,z=0,A=0;for(let N=0;N<=a;N++){const S=r[N];if((S===`
`||N===a)&&(A=N),A>z){const w=x?Zi(r,i,s,n,z,A):Hi;for(let E=0;E<=w.length;E++){const k=E===0?z:w[E-1],G=E<w.length?w[E]:A;Ki(r,k,G,n,c,C);for(let U=k;U<G;U++)f[U]=O,p[U]=C[0];b++,O+=t,m[0]=Math.max(m[0],C[0])}z=A}S===`
`&&(c[z]=0,f[z]=0,p[z]=0,z++)}return m[1]=b*t,{x:c,y:f,rowWidth:p,size:m}}function Xi({value:o,length:e,stride:t,offset:i,startIndices:s,characterSet:n}){const r=o.BYTES_PER_ELEMENT,a=t?t/r:1,c=i?i/r:0,f=s[e]||Math.ceil((o.length-c)/a),p=n&&new Set,x=new Array(e);let m=o;if(a>1||c>0){const C=o.constructor;m=new C(f);for(let b=0;b<f;b++)m[b]=o[b*a+c]}for(let C=0;C<e;C++){const b=s[C],O=s[C+1]||f,z=m.subarray(b,O);x[C]=String.fromCodePoint.apply(null,z),p&&z.forEach(p.add,p)}if(p)for(const C of p)n.add(String.fromCodePoint(C));return{texts:x,characterCount:f}}class _t{constructor(e=5){this._cache={},this._order=[],this.limit=e}get(e){const t=this._cache[e];return t&&(this._deleteOrder(e),this._appendOrder(e)),t}set(e,t){this._cache[e]?(this.delete(e),this._cache[e]=t,this._appendOrder(e)):(Object.keys(this._cache).length===this.limit&&this.delete(this._order[0]),this._cache[e]=t,this._appendOrder(e))}delete(e){this._cache[e]&&(delete this._cache[e],this._deleteOrder(e))}_deleteOrder(e){const t=this._order.indexOf(e);t>=0&&this._order.splice(t,1)}_appendOrder(e){this._order.push(e)}}function Ji(){const o=[];for(let e=32;e<128;e++)o.push(String.fromCharCode(e));return o}const J={fontFamily:"Monaco, monospace",fontWeight:"normal",characterSet:Ji(),fontSize:64,buffer:4,sdf:!1,cutoff:.25,radius:12,smoothing:.1},et=1024,tt=.9,it=.3,Ct=3;let ye=new _t(Ct);function qi(o,e){let t;typeof e=="string"?t=new Set(Array.from(e)):t=new Set(e);const i=ye.get(o);if(!i)return t;for(const s in i.mapping)t.has(s)&&t.delete(s);return t}function Qi(o,e){for(let t=0;t<o.length;t++)e.data[4*t+3]=o[t]}function ot(o,e,t,i){o.font=`${i} ${t}px ${e}`,o.fillStyle="#000",o.textBaseline="alphabetic",o.textAlign="left"}function eo(o,e,t){if(t===void 0){const s=o.measureText("A");return s.fontBoundingBoxAscent?{advance:0,width:0,ascent:Math.ceil(s.fontBoundingBoxAscent),descent:Math.ceil(s.fontBoundingBoxDescent)}:{advance:0,width:0,ascent:e*tt,descent:e*it}}const i=o.measureText(t);return i.actualBoundingBoxAscent?{advance:i.width,width:Math.ceil(i.actualBoundingBoxRight-i.actualBoundingBoxLeft),ascent:Math.ceil(i.actualBoundingBoxAscent),descent:Math.ceil(i.actualBoundingBoxDescent)}:{advance:i.width,width:i.width,ascent:e*tt,descent:e*it}}function to(o){Z.assert(Number.isFinite(o)&&o>=Ct,"Invalid cache limit"),ye=new _t(o)}class io{constructor(){this.props={...J}}get atlas(){return this._atlas}get mapping(){return this._atlas&&this._atlas.mapping}setProps(e={}){Object.assign(this.props,e),e._getFontRenderer&&(this._getFontRenderer=e._getFontRenderer),this._key=this._getKey();const t=qi(this._key,this.props.characterSet),i=ye.get(this._key);if(i&&t.size===0){this._atlas!==i&&(this._atlas=i);return}const s=this._generateFontAtlas(t,i);this._atlas=s,ye.set(this._key,s)}_generateFontAtlas(e,t){const{fontFamily:i,fontWeight:s,fontSize:n,buffer:r,sdf:a,radius:c,cutoff:f}=this.props;let p=t&&t.data;p||(p=document.createElement("canvas"),p.width=et);const x=p.getContext("2d",{willReadFrequently:!0});ot(x,i,n,s);const m=w=>eo(x,n,w);let C;this._getFontRenderer?C=this._getFontRenderer(this.props):a&&(C={measure:m,draw:oo(this.props)});const{mapping:b,canvasHeight:O,xOffset:z,yOffsetMin:A,yOffsetMax:N}=Vi({measureText:w=>C?C.measure(w):m(w),buffer:r,characterSet:e,maxCanvasWidth:et,...t&&{mapping:t.mapping,xOffset:t.xOffset,yOffsetMin:t.yOffsetMin,yOffsetMax:t.yOffsetMax}});if(p.height!==O){const w=p.height>0?x.getImageData(0,0,p.width,p.height):null;p.height=O,w&&x.putImageData(w,0,0)}if(ot(x,i,n,s),C)for(const w of e){const E=b[w],{data:k,left:G=0,top:U=0}=C.draw(w),R=E.x-G,W=E.y-U,j=Math.max(0,Math.round(R)),V=Math.max(0,Math.round(W)),$=Math.min(k.width,p.width-j),Y=Math.min(k.height,p.height-V);x.putImageData(k,j,V,0,0,$,Y),E.x+=j-R,E.y+=V-W}else for(const w of e){const E=b[w];x.fillText(w,E.x,E.y+E.anchorY)}const S=C?C.measure():m();return{baselineOffset:(S.ascent-S.descent)/2,xOffset:z,yOffsetMin:A,yOffsetMax:N,mapping:b,data:p,width:p.width,height:p.height}}_getKey(){const{fontFamily:e,fontWeight:t,fontSize:i,buffer:s,sdf:n,radius:r,cutoff:a}=this.props;return n?`${e} ${t} ${i} ${s} ${r} ${a}`:`${e} ${t} ${i} ${s}`}}function oo({fontSize:o,buffer:e,radius:t,cutoff:i,fontFamily:s,fontWeight:n}){const r=new Ui({fontSize:o,buffer:e,radius:t,cutoff:i,fontFamily:s,fontWeight:`${n}`});return a=>{const{data:c,width:f,height:p}=r.draw(a),x=new ImageData(f,p);return Qi(c,x),{data:x,left:e,top:e}}}const nt=`layout(std140) uniform textBackgroundUniforms {
  bool billboard;
  float sizeScale;
  float sizeMinPixels;
  float sizeMaxPixels;
  vec4 borderRadius;
  vec4 padding;
  highp int sizeUnits;
  bool stroked;
} textBackground;
`,no={name:"textBackground",vs:nt,fs:nt,uniformTypes:{billboard:"f32",sizeScale:"f32",sizeMinPixels:"f32",sizeMaxPixels:"f32",borderRadius:"vec4<f32>",padding:"vec4<f32>",sizeUnits:"i32",stroked:"f32"}},so=`#version 300 es
#define SHADER_NAME text-background-layer-vertex-shader
in vec2 positions;
in vec3 instancePositions;
in vec3 instancePositions64Low;
in vec4 instanceRects;
in vec4 instanceClipRect;
in float instanceSizes;
in float instanceAngles;
in vec2 instancePixelOffsets;
in float instanceLineWidths;
in vec4 instanceFillColors;
in vec4 instanceLineColors;
in vec3 instancePickingColors;
out vec4 vFillColor;
out vec4 vLineColor;
out float vLineWidth;
out vec2 uv;
out vec2 dimensions;
vec2 rotate_by_angle(vec2 vertex, float angle) {
float angle_radian = radians(angle);
float cos_angle = cos(angle_radian);
float sin_angle = sin(angle_radian);
mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
return rotationMatrix * vertex;
}
void main(void) {
geometry.worldPosition = instancePositions;
geometry.uv = positions;
geometry.pickingColor = instancePickingColors;
uv = positions;
vLineWidth = instanceLineWidths;
float sizePixels = clamp(
project_size_to_pixel(instanceSizes * textBackground.sizeScale, textBackground.sizeUnits),
textBackground.sizeMinPixels, textBackground.sizeMaxPixels
);
float instanceScale = sizePixels / text.fontSize;
dimensions = instanceRects.zw * instanceScale + textBackground.padding.xy + textBackground.padding.zw;
vec2 pixelOffset = (positions * instanceRects.zw + instanceRects.xy) * instanceScale + mix(-textBackground.padding.xy, textBackground.padding.zw, positions);
pixelOffset = rotate_by_angle(pixelOffset, instanceAngles);
pixelOffset += instancePixelOffsets;
pixelOffset.y *= -1.0;
vec2 xy = project_size_to_pixel(instanceClipRect.xy);
vec2 wh = project_size_to_pixel(instanceClipRect.zw);
if (text.flipY) {
xy.y = -xy.y - wh.y;
}
if (instanceClipRect.z >= 0.0) {
dimensions.x = wh.x;
pixelOffset.x = xy.x + uv.x * wh.x + mix(-textBackground.padding.x, textBackground.padding.z, uv.x);
}
if (instanceClipRect.w >= 0.0) {
dimensions.y = wh.y;
pixelOffset.y = xy.y + uv.y * wh.y + mix(-textBackground.padding.y, textBackground.padding.w, uv.y);
}
if (textBackground.billboard)  {
gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
vec3 offset = vec3(pixelOffset, 0.0);
DECKGL_FILTER_SIZE(offset, geometry);
gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
} else {
vec3 offset_common = vec3(project_pixel_size(pixelOffset), 0.0);
if (text.flipY) {
offset_common.y *= -1.;
}
DECKGL_FILTER_SIZE(offset_common, geometry);
gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset_common, geometry.position);
DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
}
vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * layer.opacity);
DECKGL_FILTER_COLOR(vFillColor, geometry);
vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * layer.opacity);
DECKGL_FILTER_COLOR(vLineColor, geometry);
}
`,ro=`#version 300 es
#define SHADER_NAME text-background-layer-fragment-shader
precision highp float;
in vec4 vFillColor;
in vec4 vLineColor;
in float vLineWidth;
in vec2 uv;
in vec2 dimensions;
out vec4 fragColor;
float round_rect(vec2 p, vec2 size, vec4 radii) {
vec2 pixelPositionCB = (p - 0.5) * size;
vec2 sizeCB = size * 0.5;
float maxBorderRadius = min(size.x, size.y) * 0.5;
vec4 borderRadius = vec4(min(radii, maxBorderRadius));
borderRadius.xy =
(pixelPositionCB.x > 0.0) ? borderRadius.xy : borderRadius.zw;
borderRadius.x = (pixelPositionCB.y > 0.0) ? borderRadius.x : borderRadius.y;
vec2 q = abs(pixelPositionCB) - sizeCB + borderRadius.x;
return -(min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - borderRadius.x);
}
float rect(vec2 p, vec2 size) {
vec2 pixelPosition = p * size;
return min(min(pixelPosition.x, size.x - pixelPosition.x),
min(pixelPosition.y, size.y - pixelPosition.y));
}
vec4 get_stroked_fragColor(float dist) {
float isBorder = smoothedge(dist, vLineWidth);
return mix(vFillColor, vLineColor, isBorder);
}
void main(void) {
geometry.uv = uv;
if (textBackground.borderRadius != vec4(0.0)) {
float distToEdge = round_rect(uv, dimensions, textBackground.borderRadius);
float shapeAlpha = smoothedge(-distToEdge, 0.0);
if (shapeAlpha == 0.0) {
discard;
}
if (textBackground.stroked) {
fragColor = get_stroked_fragColor(distToEdge);
} else {
fragColor = vFillColor;
}
fragColor.a *= shapeAlpha;
} else {
if (textBackground.stroked) {
float distToEdge = rect(uv, dimensions);
fragColor = get_stroked_fragColor(distToEdge);
} else {
fragColor = vFillColor;
}
}
DECKGL_FILTER_COLOR(fragColor, geometry);
}
`,ao={billboard:!0,sizeScale:1,sizeUnits:"pixels",sizeMinPixels:0,sizeMaxPixels:Number.MAX_SAFE_INTEGER,fontSize:1,borderRadius:{type:"object",value:0},padding:{type:"array",value:[0,0,0,0]},getPosition:{type:"accessor",value:o=>o.position},getSize:{type:"accessor",value:1},getAngle:{type:"accessor",value:0},getPixelOffset:{type:"accessor",value:[0,0]},getBoundingRect:{type:"accessor",value:[0,0,0,0]},getClipRect:{type:"accessor",value:[0,0,-1,-1]},getFillColor:{type:"accessor",value:[0,0,0,255]},getLineColor:{type:"accessor",value:[0,0,0,255]},getLineWidth:{type:"accessor",value:1}};class Ee extends me{getShaders(){return super.getShaders({vs:so,fs:ro,modules:[ze,Ae,no,vt]})}initializeState(){this.getAttributeManager().addInstanced({instancePositions:{size:3,type:"float64",fp64:this.use64bitPositions(),transition:!0,accessor:"getPosition"},instanceSizes:{size:1,transition:!0,accessor:"getSize",defaultValue:1},instanceAngles:{size:1,transition:!0,accessor:"getAngle"},instanceRects:{size:4,accessor:"getBoundingRect"},instanceClipRect:{size:4,accessor:"getClipRect",defaultValue:[0,0,-1,-1]},instancePixelOffsets:{size:2,transition:!0,accessor:"getPixelOffset"},instanceFillColors:{size:4,transition:!0,type:"unorm8",accessor:"getFillColor",defaultValue:[0,0,0,255]},instanceLineColors:{size:4,transition:!0,type:"unorm8",accessor:"getLineColor",defaultValue:[0,0,0,255]},instanceLineWidths:{size:1,transition:!0,accessor:"getLineWidth",defaultValue:1}})}updateState(e){super.updateState(e);const{changeFlags:t}=e;t.extensionsChanged&&(this.state.model?.destroy(),this.state.model=this._getModel(),this.getAttributeManager().invalidateAll())}draw({uniforms:e}){const{billboard:t,sizeScale:i,sizeUnits:s,sizeMinPixels:n,sizeMaxPixels:r,getLineWidth:a,fontSize:c}=this.props;let{padding:f,borderRadius:p}=this.props;f.length<4&&(f=[f[0],f[1],f[0],f[1]]),Array.isArray(p)||(p=[p,p,p,p]);const x=this.state.model,m={billboard:t,stroked:!!a,borderRadius:p,padding:f,sizeUnits:ct[s],sizeScale:i,sizeMinPixels:n,sizeMaxPixels:r},C={fontSize:c,viewport:this.context.viewport};x.shaderInputs.setProps({textBackground:m,text:C}),x.draw(this.context.renderPass)}_getModel(){const e=[0,0,1,0,0,1,1,1];return new oe(this.context.device,{...this.getShaders(),id:this.props.id,bufferLayout:this.getAttributeManager().getBufferLayouts(),geometry:new xe({topology:"triangle-strip",vertexCount:4,attributes:{positions:{size:2,value:new Float32Array(e)}}}),isInstanced:!0})}}Ee.defaultProps=ao;Ee.layerName="TextBackgroundLayer";const st={start:1,middle:0,end:-1},rt={top:1,center:0,bottom:-1},Pe=[0,0,0,255],lo=1,co={billboard:!0,sizeScale:1,sizeUnits:"pixels",sizeMinPixels:0,sizeMaxPixels:Number.MAX_SAFE_INTEGER,background:!1,getBackgroundColor:{type:"accessor",value:[255,255,255,255]},getBorderColor:{type:"accessor",value:Pe},getBorderWidth:{type:"accessor",value:0},backgroundBorderRadius:{type:"object",value:0},backgroundPadding:{type:"array",value:[0,0,0,0]},characterSet:{type:"object",value:J.characterSet},fontFamily:J.fontFamily,fontWeight:J.fontWeight,lineHeight:lo,outlineWidth:{type:"number",value:0,min:0},outlineColor:{type:"color",value:Pe},fontSettings:{type:"object",value:{},compare:1},wordBreak:"break-word",maxWidth:{type:"number",value:-1},contentCutoffPixels:{type:"array",value:[0,0]},contentAlignHorizontal:"none",contentAlignVertical:"none",getText:{type:"accessor",value:o=>o.text},getPosition:{type:"accessor",value:o=>o.position},getColor:{type:"accessor",value:Pe},getSize:{type:"accessor",value:32},getAngle:{type:"accessor",value:0},getTextAnchor:{type:"accessor",value:"middle"},getAlignmentBaseline:{type:"accessor",value:"center"},getPixelOffset:{type:"accessor",value:[0,0]},getContentBox:{type:"accessor",value:[0,0,-1,-1]},backgroundColor:{deprecatedFor:["background","getBackgroundColor"]}};class Re extends Te{constructor(){super(...arguments),this.getBoundingRect=(e,t)=>{const{size:[i,s]}=this.transformParagraph(e,t),{getTextAnchor:n,getAlignmentBaseline:r}=this.props,a=st[typeof n=="function"?n(e,t):n],c=rt[typeof r=="function"?r(e,t):r];return[(a-1)*i/2,(c-1)*s/2,i,s]},this.getIconOffsets=(e,t)=>{const{getTextAnchor:i,getAlignmentBaseline:s}=this.props,{x:n,y:r,rowWidth:a,size:[,c]}=this.transformParagraph(e,t),f=st[typeof i=="function"?i(e,t):i],p=rt[typeof s=="function"?s(e,t):s],x=n.length,m=new Array(x*2);let C=0;for(let b=0;b<x;b++)m[C++]=(f-1)*a[b]/2+n[b],m[C++]=(p-1)*c/2+r[b];return m}}initializeState(){this.state={styleVersion:0,fontAtlasManager:new io},this.props.maxWidth>0&&Z.once(1,"v8.9 breaking change: TextLayer maxWidth is now relative to text size")()}updateState(e){const{props:t,oldProps:i,changeFlags:s}=e;(s.dataChanged||s.updateTriggersChanged&&(s.updateTriggersChanged.all||s.updateTriggersChanged.getText))&&this._updateText(),(this._updateFontAtlas()||t.lineHeight!==i.lineHeight||t.wordBreak!==i.wordBreak||t.maxWidth!==i.maxWidth)&&this.setState({styleVersion:this.state.styleVersion+1})}getPickingInfo({info:e}){return e.object=e.index>=0?this.props.data[e.index]:null,e}_updateFontAtlas(){const{fontSettings:e,fontFamily:t,fontWeight:i,_getFontRenderer:s}=this.props,{fontAtlasManager:n,characterSet:r}=this.state,a={...e,characterSet:r,fontFamily:t,fontWeight:i,_getFontRenderer:s};if(!n.mapping)return n.setProps(a),!0;for(const c in a)if(a[c]!==n.props[c])return n.setProps(a),!0;return!1}_updateText(){const{data:e,characterSet:t}=this.props,i=e.attributes?.getText;let{getText:s}=this.props,n=e.startIndices,r;const a=t==="auto"&&new Set;if(i&&n){const{texts:c,characterCount:f}=Xi({...ArrayBuffer.isView(i)?{value:i}:i,length:e.length,startIndices:n,characterSet:a});r=f,s=(p,{index:x})=>c[x]}else{const{iterable:c,objectInfo:f}=we(e);n=[0],r=0;for(const p of c){f.index++;const x=Array.from(s(p,f)||"");a&&x.forEach(a.add,a),r+=x.length,n.push(r)}}this.setState({getText:s,startIndices:n,numInstances:r,characterSet:a||t})}transformParagraph(e,t){const{fontAtlasManager:i}=this.state,s=i.mapping,{baselineOffset:n}=i.atlas,{fontSize:r}=i.props,a=this.state.getText,{wordBreak:c,lineHeight:f,maxWidth:p}=this.props,x=a(e,t)||"";return Yi(x,n,f*r,c,p*r,s)}renderLayers(){const{startIndices:e,numInstances:t,getText:i,fontAtlasManager:{atlas:s,mapping:n},styleVersion:r}=this.state,{data:a,_dataDiff:c,getPosition:f,getColor:p,getSize:x,getAngle:m,getPixelOffset:C,getBackgroundColor:b,getBorderColor:O,getBorderWidth:z,getContentBox:A,backgroundBorderRadius:N,backgroundPadding:S,background:w,billboard:E,fontSettings:k,outlineWidth:G,outlineColor:U,sizeScale:R,sizeUnits:W,sizeMinPixels:j,sizeMaxPixels:V,contentCutoffPixels:$,contentAlignHorizontal:Y,contentAlignVertical:q,transitions:l,updateTriggers:u}=this.props,g=this.getSubLayerClass("characters",Ie),d=this.getSubLayerClass("background",Ee),{fontSize:h}=this.state.fontAtlasManager.props;return[w&&new d({getFillColor:b,getLineColor:O,getLineWidth:z,borderRadius:N,padding:S,getPosition:f,getSize:x,getAngle:m,getPixelOffset:C,getClipRect:A,billboard:E,sizeScale:R,sizeUnits:W,sizeMinPixels:j,sizeMaxPixels:V,fontSize:h,transitions:l&&{getPosition:l.getPosition,getAngle:l.getAngle,getSize:l.getSize,getFillColor:l.getBackgroundColor,getLineColor:l.getBorderColor,getLineWidth:l.getBorderWidth,getPixelOffset:l.getPixelOffset}},this.getSubLayerProps({id:"background",updateTriggers:{getPosition:u.getPosition,getAngle:u.getAngle,getSize:u.getSize,getFillColor:u.getBackgroundColor,getLineColor:u.getBorderColor,getLineWidth:u.getBorderWidth,getPixelOffset:u.getPixelOffset,getBoundingRect:{getText:u.getText,getTextAnchor:u.getTextAnchor,getAlignmentBaseline:u.getAlignmentBaseline,styleVersion:r}}}),{data:a.attributes&&a.attributes.background?{length:a.length,attributes:a.attributes.background}:a,_dataDiff:c,autoHighlight:!1,getBoundingRect:this.getBoundingRect}),new g({sdf:k.sdf,smoothing:Number.isFinite(k.smoothing)?k.smoothing:J.smoothing,outlineWidth:G/(k.radius||J.radius),outlineColor:U,iconAtlas:s,iconMapping:n,getPosition:f,getColor:p,getSize:x,getAngle:m,getPixelOffset:C,getContentBox:A,billboard:E,sizeScale:R,sizeUnits:W,sizeMinPixels:j,sizeMaxPixels:V,fontSize:h,contentCutoffPixels:$,contentAlignHorizontal:Y,contentAlignVertical:q,transitions:l&&{getPosition:l.getPosition,getAngle:l.getAngle,getColor:l.getColor,getSize:l.getSize,getPixelOffset:l.getPixelOffset,getContentBox:l.getContentBox}},this.getSubLayerProps({id:"characters",updateTriggers:{all:u.getText,getPosition:u.getPosition,getAngle:u.getAngle,getColor:u.getColor,getSize:u.getSize,getPixelOffset:u.getPixelOffset,getContentBox:u.getContentBox,getIconOffsets:{getTextAnchor:u.getTextAnchor,getAlignmentBaseline:u.getAlignmentBaseline,styleVersion:r}}}),{data:a,_dataDiff:c,startIndices:e,numInstances:t,getIconOffsets:this.getIconOffsets,getIcon:i})]}static set fontAtlasCacheLimit(e){to(e)}}Re.defaultProps=co;Re.layerName="TextLayer";const de={circle:{type:Bt,props:{filled:"filled",stroked:"stroked",lineWidthMaxPixels:"lineWidthMaxPixels",lineWidthMinPixels:"lineWidthMinPixels",lineWidthScale:"lineWidthScale",lineWidthUnits:"lineWidthUnits",pointRadiusMaxPixels:"radiusMaxPixels",pointRadiusMinPixels:"radiusMinPixels",pointRadiusScale:"radiusScale",pointRadiusUnits:"radiusUnits",pointAntialiasing:"antialiasing",pointBillboard:"billboard",getFillColor:"getFillColor",getLineColor:"getLineColor",getLineWidth:"getLineWidth",getPointRadius:"getRadius"}},icon:{type:_e,props:{iconAtlas:"iconAtlas",iconMapping:"iconMapping",iconSizeMaxPixels:"sizeMaxPixels",iconSizeMinPixels:"sizeMinPixels",iconSizeScale:"sizeScale",iconSizeUnits:"sizeUnits",iconAlphaCutoff:"alphaCutoff",iconBillboard:"billboard",getIcon:"getIcon",getIconAngle:"getAngle",getIconColor:"getColor",getIconPixelOffset:"getPixelOffset",getIconSize:"getSize"}},text:{type:Re,props:{textSizeMaxPixels:"sizeMaxPixels",textSizeMinPixels:"sizeMinPixels",textSizeScale:"sizeScale",textSizeUnits:"sizeUnits",textBackground:"background",textBackgroundPadding:"backgroundPadding",textFontFamily:"fontFamily",textFontWeight:"fontWeight",textLineHeight:"lineHeight",textMaxWidth:"maxWidth",textOutlineColor:"outlineColor",textOutlineWidth:"outlineWidth",textWordBreak:"wordBreak",textCharacterSet:"characterSet",textBillboard:"billboard",textFontSettings:"fontSettings",getText:"getText",getTextAngle:"getAngle",getTextColor:"getColor",getTextPixelOffset:"getPixelOffset",getTextSize:"getSize",getTextAnchor:"getTextAnchor",getTextAlignmentBaseline:"getAlignmentBaseline",getTextBackgroundColor:"getBackgroundColor",getTextBorderColor:"getBorderColor",getTextBorderWidth:"getBorderWidth"}}},he={type:Ft,props:{lineWidthUnits:"widthUnits",lineWidthScale:"widthScale",lineWidthMinPixels:"widthMinPixels",lineWidthMaxPixels:"widthMaxPixels",lineJointRounded:"jointRounded",lineCapRounded:"capRounded",lineMiterLimit:"miterLimit",lineBillboard:"billboard",getLineColor:"getColor",getLineWidth:"getWidth"}},be={type:Me,props:{extruded:"extruded",filled:"filled",wireframe:"wireframe",elevationScale:"elevationScale",material:"material",_full3d:"_full3d",getElevation:"getElevation",getFillColor:"getFillColor",getLineColor:"getLineColor"}};function te({type:o,props:e}){const t={};for(const i in e)t[i]=o.defaultProps[e[i]];return t}function Se(o,e){const{transitions:t,updateTriggers:i}=o.props,s={updateTriggers:{},transitions:t&&{getPosition:t.geometry}};for(const n in e){const r=e[n];let a=o.props[n];n.startsWith("get")&&(a=o.getSubLayerAccessor(a),s.updateTriggers[r]=i[n],t&&(s.transitions[r]=t[n])),s[r]=a}return s}function go(o){if(Array.isArray(o))return o;switch(Z.assert(o.type,"GeoJSON does not have type"),o.type){case"Feature":return[o];case"FeatureCollection":return Z.assert(Array.isArray(o.features),"GeoJSON does not have features array"),o.features;default:return[{geometry:o}]}}function at(o,e,t={}){const i={pointFeatures:[],lineFeatures:[],polygonFeatures:[],polygonOutlineFeatures:[]},{startRow:s=0,endRow:n=o.length}=t;for(let r=s;r<n;r++){const a=o[r],{geometry:c}=a;if(c)if(c.type==="GeometryCollection"){Z.assert(Array.isArray(c.geometries),"GeoJSON does not have geometries array");const{geometries:f}=c;for(let p=0;p<f.length;p++){const x=f[p];lt(x,i,e,a,r)}}else lt(c,i,e,a,r)}return i}function lt(o,e,t,i,s){const{type:n,coordinates:r}=o,{pointFeatures:a,lineFeatures:c,polygonFeatures:f,polygonOutlineFeatures:p}=e;if(!fo(n,r)){Z.warn(`${n} coordinates are malformed`)();return}switch(n){case"Point":a.push(t({geometry:o},i,s));break;case"MultiPoint":r.forEach(x=>{a.push(t({geometry:{type:"Point",coordinates:x}},i,s))});break;case"LineString":c.push(t({geometry:o},i,s));break;case"MultiLineString":r.forEach(x=>{c.push(t({geometry:{type:"LineString",coordinates:x}},i,s))});break;case"Polygon":f.push(t({geometry:o},i,s)),r.forEach(x=>{p.push(t({geometry:{type:"LineString",coordinates:x}},i,s))});break;case"MultiPolygon":r.forEach(x=>{f.push(t({geometry:{type:"Polygon",coordinates:x}},i,s)),x.forEach(m=>{p.push(t({geometry:{type:"LineString",coordinates:m}},i,s))})});break}}const uo={Point:1,MultiPoint:2,LineString:2,MultiLineString:3,Polygon:3,MultiPolygon:4};function fo(o,e){let t=uo[o];for(Z.assert(t,`Unknown GeoJSON type ${o}`);e&&--t>0;)e=e[0];return e&&Number.isFinite(e[0])}function Lt(){return{points:{},lines:{},polygons:{},polygonsOutline:{}}}function ue(o){return o.geometry.coordinates}function po(o,e){const t=Lt(),{pointFeatures:i,lineFeatures:s,polygonFeatures:n,polygonOutlineFeatures:r}=o;return t.points.data=i,t.points._dataDiff=e.pointFeatures&&(()=>e.pointFeatures),t.points.getPosition=ue,t.lines.data=s,t.lines._dataDiff=e.lineFeatures&&(()=>e.lineFeatures),t.lines.getPath=ue,t.polygons.data=n,t.polygons._dataDiff=e.polygonFeatures&&(()=>e.polygonFeatures),t.polygons.getPolygon=ue,t.polygonsOutline.data=r,t.polygonsOutline._dataDiff=e.polygonOutlineFeatures&&(()=>e.polygonOutlineFeatures),t.polygonsOutline.getPath=ue,t}function ho(o,e){const t=Lt(),{points:i,lines:s,polygons:n}=o,r=Fi(o,e);t.points.data={length:i.positions.value.length/i.positions.size,attributes:{...i.attributes,getPosition:i.positions,instancePickingColors:{size:4,value:r.points}},properties:i.properties,numericProps:i.numericProps,featureIds:i.featureIds},t.lines.data={length:s.pathIndices.value.length-1,startIndices:s.pathIndices.value,attributes:{...s.attributes,getPath:s.positions,instancePickingColors:{size:4,value:r.lines}},properties:s.properties,numericProps:s.numericProps,featureIds:s.featureIds},t.lines._pathType="open";const a=n.positions.value.length/n.positions.size,c=Array(a).fill(1);for(const f of n.primitivePolygonIndices.value)c[f-1]=0;return t.polygons.data={length:n.polygonIndices.value.length-1,startIndices:n.polygonIndices.value,attributes:{...n.attributes,getPolygon:n.positions,instanceVertexValid:{size:1,value:new Uint16Array(c)},pickingColors:{size:4,value:r.polygons}},properties:n.properties,numericProps:n.numericProps,featureIds:n.featureIds},t.polygons._normalize=!1,n.triangles&&(t.polygons.data.attributes.indices=n.triangles.value),t.polygonsOutline.data={length:n.primitivePolygonIndices.value.length-1,startIndices:n.primitivePolygonIndices.value,attributes:{...n.attributes,getPath:n.positions,instancePickingColors:{size:4,value:r.polygons}},properties:n.properties,numericProps:n.numericProps,featureIds:n.featureIds},t.polygonsOutline._pathType="open",t}const xo=["points","linestrings","polygons"],vo={...te(de.circle),...te(de.icon),...te(de.text),...te(he),...te(be),stroked:!0,filled:!0,extruded:!1,wireframe:!1,_full3d:!1,iconAtlas:{type:"object",value:null},iconMapping:{type:"object",value:{}},getIcon:{type:"accessor",value:o=>o.properties.icon},getText:{type:"accessor",value:o=>o.properties.text},pointType:"circle",getRadius:{deprecatedFor:"getPointRadius"}};class Pt extends Te{initializeState(){this.state={layerProps:{},features:{},featuresDiff:{}}}updateState({props:e,changeFlags:t}){if(!t.dataChanged)return;const{data:i}=this.props,s=i&&"points"in i&&"polygons"in i&&"lines"in i;this.setState({binary:s}),s?this._updateStateBinary({props:e,changeFlags:t}):this._updateStateJSON({props:e,changeFlags:t})}_updateStateBinary({props:e,changeFlags:t}){const i=ho(e.data,this.encodePickingColor);this.setState({layerProps:i})}_updateStateJSON({props:e,changeFlags:t}){const i=go(e.data),s=this.getSubLayerRow.bind(this);let n={};const r={};if(Array.isArray(t.dataChanged)){const c=this.state.features;for(const f in c)n[f]=c[f].slice(),r[f]=[];for(const f of t.dataChanged){const p=at(i,s,f);for(const x in c)r[x].push(Oi({data:n[x],getIndex:m=>m.__source.index,dataRange:f,replace:p[x]}))}}else n=at(i,s);const a=po(n,r);this.setState({features:n,featuresDiff:r,layerProps:a})}getPickingInfo(e){const t=super.getPickingInfo(e),{index:i,sourceLayer:s}=t;return t.featureType=xo.find(n=>s.id.startsWith(`${this.id}-${n}-`)),i>=0&&s.id.startsWith(`${this.id}-points-text`)&&this.state.binary&&(t.index=this.props.data.points.globalFeatureIds.value[i]),t}_updateAutoHighlight(e){const t=`${this.id}-points-`,i=e.featureType==="points";for(const s of this.getSubLayers())s.id.startsWith(t)===i&&s.updateAutoHighlight(e)}_renderPolygonLayer(){const{extruded:e,wireframe:t}=this.props,{layerProps:i}=this.state,s="polygons-fill",n=this.shouldRenderSubLayer(s,i.polygons?.data)&&this.getSubLayerClass(s,be.type);if(n){const r=Se(this,be.props),a=e&&t;return a||delete r.getLineColor,r.updateTriggers.lineColors=a,new n(r,this.getSubLayerProps({id:s,updateTriggers:r.updateTriggers}),i.polygons)}return null}_renderLineLayers(){const{extruded:e,stroked:t}=this.props,{layerProps:i}=this.state,s="polygons-stroke",n="linestrings",r=!e&&t&&this.shouldRenderSubLayer(s,i.polygonsOutline?.data)&&this.getSubLayerClass(s,he.type),a=this.shouldRenderSubLayer(n,i.lines?.data)&&this.getSubLayerClass(n,he.type);if(r||a){const c=Se(this,he.props);return[r&&new r(c,this.getSubLayerProps({id:s,updateTriggers:c.updateTriggers}),i.polygonsOutline),a&&new a(c,this.getSubLayerProps({id:n,updateTriggers:c.updateTriggers}),i.lines)]}return null}_renderPointLayers(){const{pointType:e}=this.props,{layerProps:t,binary:i}=this.state;let{highlightedObjectIndex:s}=this.props;!i&&Number.isFinite(s)&&(s=t.points.data.findIndex(a=>a.__source.index===s));const n=new Set(e.split("+")),r=[];for(const a of n){const c=`points-${a}`,f=de[a],p=f&&this.shouldRenderSubLayer(c,t.points?.data)&&this.getSubLayerClass(c,f.type);if(p){const x=Se(this,f.props);let m=t.points;if(a==="text"&&i){const{instancePickingColors:C,...b}=m.data.attributes;m={...m,data:{...m.data,attributes:b}}}r.push(new p(x,this.getSubLayerProps({id:c,updateTriggers:x.updateTriggers,highlightedObjectIndex:s}),m))}}return r}renderLayers(){const{extruded:e}=this.props,t=this._renderPolygonLayer(),i=this._renderLineLayers(),s=this._renderPointLayers();return[!e&&t,i,s,e&&t]}getSubLayerAccessor(e){const{binary:t}=this.state;return!t||typeof e!="function"?super.getSubLayerAccessor(e):(i,s)=>{const{data:n,index:r}=s,a=Ei(n,r);return e(a,s)}}}Pt.layerName="GeoJsonLayer";Pt.defaultProps=vo;export{Te as C,Pt as G,Yt as P,Me as S,Re as T,Kt as a,Xt as b,Nt as f,ut as g,Wt as l,Si as n,Oi as r};
