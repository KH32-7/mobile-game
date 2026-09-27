(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e,t,n,r,i,a,o,s,c,l=1e3,u=1001,d=1002,f=1003,p=1004,m=1005,h=1006,g=1007,_=1008,v=1009,y=1010,b=1011,x=1012,S=1013,C=1014,w=1015,T=1016,E=1017,D=1018,ee=1020,O=35902,k=35899,A=1021,j=1022,M=1023,te=1026,N=1027,ne=1028,re=1029,ie=1030,ae=1031,oe=1033,se=33776,ce=33777,le=33778,P=33779,ue=35840,de=35841,fe=35842,pe=35843,me=36196,he=37492,ge=37496,_e=37488,ve=37489,ye=37490,be=37491,xe=37808,Se=37809,Ce=37810,we=37811,Te=37812,Ee=37813,De=37814,Oe=37815,ke=37816,Ae=37817,je=37818,Me=37819,Ne=37820,F=37821,Pe=36492,Fe=36494,Ie=36495,I=36283,Le=36284,L=36285,Re=36286,ze=2300,Be=2301,Ve=2302,He=2303,Ue=2400,We=2401,Ge=2402,Ke=3200,qe=`srgb`,Je=`srgb-linear`,Ye=`linear`,Xe=`srgb`,Ze=7680,Qe=35044,$e=35048,et=2e3;function tt(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function nt(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function rt(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function it(){let e=rt(`canvas`);return e.style.display=`block`,e}var at={};function ot(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function st(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function R(...e){e=st(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function z(...e){e=st(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function ct(...e){let t=e.join(` `);t in at||(at[t]=!0,R(...e))}function lt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var ut={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},dt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},ft=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),pt=1234567,mt=Math.PI/180,ht=180/Math.PI;function gt(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(ft[e&255]+ft[e>>8&255]+ft[e>>16&255]+ft[e>>24&255]+`-`+ft[t&255]+ft[t>>8&255]+`-`+ft[t>>16&15|64]+ft[t>>24&255]+`-`+ft[n&63|128]+ft[n>>8&255]+`-`+ft[n>>16&255]+ft[n>>24&255]+ft[r&255]+ft[r>>8&255]+ft[r>>16&255]+ft[r>>24&255]).toLowerCase()}function _t(e,t,n){return Math.max(t,Math.min(n,e))}function vt(e,t){return(e%t+t)%t}function yt(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function bt(e,t,n){return e===t?0:(n-e)/(t-e)}function xt(e,t,n){return(1-n)*e+n*t}function St(e,t,n,r){return xt(e,t,1-Math.exp(-n*r))}function Ct(e,t=1){return t-Math.abs(vt(e,t*2)-t)}function wt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function Tt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function Et(e,t){return e+Math.floor(Math.random()*(t-e+1))}function Dt(e,t){return e+Math.random()*(t-e)}function Ot(e){return e*(.5-Math.random())}function kt(e){e!==void 0&&(pt=e);let t=pt+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function At(e){return e*mt}function jt(e){return e*ht}function Mt(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Nt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Pt(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Ft(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:R(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function It(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Lt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Rt={DEG2RAD:mt,RAD2DEG:ht,generateUUID:gt,clamp:_t,euclideanModulo:vt,mapLinear:yt,inverseLerp:bt,lerp:xt,damp:St,pingpong:Ct,smoothstep:wt,smootherstep:Tt,randInt:Et,randFloat:Dt,randFloatSpread:Ot,seededRandom:kt,degToRad:At,radToDeg:jt,isPowerOfTwo:Mt,ceilPowerOfTwo:Nt,floorPowerOfTwo:Pt,setQuaternionFromProperEuler:Ft,normalize:Lt,denormalize:It};o=Symbol.iterator;var B=class{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=_t(this.x,e.x,t.x),this.y=_t(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=_t(this.x,e,t),this.y=_t(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(_t(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(_t(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[o](){yield this.x,yield this.y}};e=B,e.prototype.isVector2=!0;var zt=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:R(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(_t(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};s=Symbol.iterator;var V=class{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Vt.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Vt.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=_t(this.x,e.x,t.x),this.y=_t(this.y,e.y,t.y),this.z=_t(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=_t(this.x,e,t),this.y=_t(this.y,e,t),this.z=_t(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(_t(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Bt.copy(this).projectOnVector(e),this.sub(Bt)}reflect(e){return this.sub(Bt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(_t(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[s](){yield this.x,yield this.y,yield this.z}};t=V,t.prototype.isVector3=!0;var Bt=new V,Vt=new zt,Ht=class{constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return ct(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Ut.makeScale(e,t)),this}rotate(e){return ct(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Ut.makeRotation(-e)),this}translate(e,t){return ct(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Ut.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};n=Ht,n.prototype.isMatrix3=!0;var Ut=new Ht,Wt=new Ht().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Gt=new Ht().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Kt(){let e={enabled:!0,workingColorSpace:Je,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=Jt(e.r),e.g=Jt(e.g),e.b=Jt(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Yt(e.r),e.g=Yt(e.g),e.b=Yt(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Ye:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return ct(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return ct(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Je]:{primaries:t,whitePoint:r,transfer:Ye,toXYZ:Wt,fromXYZ:Gt,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:qe},outputColorSpaceConfig:{drawingBufferColorSpace:qe}},[qe]:{primaries:t,whitePoint:r,transfer:Xe,toXYZ:Wt,fromXYZ:Gt,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:qe}}}),e}var qt=Kt();function Jt(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Yt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Xt,Zt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Xt===void 0&&(Xt=rt(`canvas`)),Xt.width=e.width,Xt.height=e.height;let t=Xt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Xt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=rt(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Jt(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Jt(t[e]/255)*255):t[e]=Jt(t[e]);return{data:t,width:e.width,height:e.height}}return R(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Qt=0,$t=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Qt++}),this.uuid=gt(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(en(r[t].image)):e.push(en(r[t]))}else e=en(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function en(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Zt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(R(`Texture: Unable to serialize Texture.`),{})}var tn=0,nn=new V,rn=class e extends dt{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=u,i=u,a=h,o=_,s=M,c=v,l=e.DEFAULT_ANISOTROPY,d=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:tn++}),this.uuid=gt(),this.name=``,this.source=new $t(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new B(0,0),this.repeat=new B(1,1),this.center=new B(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ht,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(nn).x}get height(){return this.source.getSize(nn).y}get depth(){return this.source.getSize(nn).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){R(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){R(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case l:e.x-=Math.floor(e.x);break;case u:e.x=e.x<0?0:1;break;case d:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case l:e.y-=Math.floor(e.y);break;case u:e.y=e.y<0?0:1;break;case d:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};rn.DEFAULT_IMAGE=null,rn.DEFAULT_MAPPING=300,rn.DEFAULT_ANISOTROPY=1,c=Symbol.iterator;var an=class{constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=_t(this.x,e.x,t.x),this.y=_t(this.y,e.y,t.y),this.z=_t(this.z,e.z,t.z),this.w=_t(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=_t(this.x,e,t),this.y=_t(this.y,e,t),this.z=_t(this.z,e,t),this.w=_t(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(_t(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[c](){yield this.x,yield this.y,yield this.z,yield this.w}};r=an,r.prototype.isVector4=!0;var on=class extends dt{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:h,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new an(0,0,e,t),this.scissorTest=!1,this.viewport=new an(0,0,e,t),this.textures=[];let r=new rn({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:h,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new $t(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},sn=class extends on{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},cn=class extends rn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=f,this.minFilter=f,this.wrapR=u,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},ln=class extends rn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=f,this.minFilter=f,this.wrapR=u,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},un=class e{constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/dn.setFromMatrixColumn(e,0).length(),i=1/dn.setFromMatrixColumn(e,1).length(),a=1/dn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(pn,e,mn)}lookAt(e,t,n){let r=this.elements;return _n.subVectors(e,t),_n.lengthSq()===0&&(_n.z=1),_n.normalize(),hn.crossVectors(n,_n),hn.lengthSq()===0&&(Math.abs(n.z)===1?_n.x+=1e-4:_n.z+=1e-4,_n.normalize(),hn.crossVectors(n,_n)),hn.normalize(),gn.crossVectors(_n,hn),r[0]=hn.x,r[4]=gn.x,r[8]=_n.x,r[1]=hn.y,r[5]=gn.y,r[9]=_n.y,r[2]=hn.z,r[6]=gn.z,r[10]=_n.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],ee=r[13],O=r[2],k=r[6],A=r[10],j=r[14],M=r[3],te=r[7],N=r[11],ne=r[15];return i[0]=a*x+o*T+s*O+c*M,i[4]=a*S+o*E+s*k+c*te,i[8]=a*C+o*D+s*A+c*N,i[12]=a*w+o*ee+s*j+c*ne,i[1]=l*x+u*T+d*O+f*M,i[5]=l*S+u*E+d*k+f*te,i[9]=l*C+u*D+d*A+f*N,i[13]=l*w+u*ee+d*j+f*ne,i[2]=p*x+m*T+h*O+g*M,i[6]=p*S+m*E+h*k+g*te,i[10]=p*C+m*D+h*A+g*N,i[14]=p*w+m*ee+h*j+g*ne,i[3]=_*x+v*T+y*O+b*M,i[7]=_*S+v*E+y*k+b*te,i[11]=_*C+v*D+y*A+b*N,i[15]=_*w+v*ee+y*j+b*ne,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,ee=d*g-f*h,O=_*ee-v*D+y*E+b*T-x*w+S*C;if(O===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/O;return e[0]=(o*ee-s*D+c*E)*k,e[1]=(r*D-n*ee-i*E)*k,e[2]=(m*S-h*x+g*b)*k,e[3]=(d*x-u*S-f*b)*k,e[4]=(s*T-a*ee-c*w)*k,e[5]=(t*ee-r*T+i*w)*k,e[6]=(h*y-p*S-g*v)*k,e[7]=(l*S-d*y+f*v)*k,e[8]=(a*D-o*T+c*C)*k,e[9]=(n*T-t*D-i*C)*k,e[10]=(p*x-m*y+g*_)*k,e[11]=(u*y-l*x-f*_)*k,e[12]=(o*w-a*E-s*C)*k,e[13]=(t*E-n*w+r*C)*k,e[14]=(m*v-p*b-h*_)*k,e[15]=(l*b-u*v+d*_)*k,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=dn.set(r[0],r[1],r[2]).length(),o=dn.set(r[4],r[5],r[6]).length(),s=dn.set(r[8],r[9],r[10]).length();i<0&&(a=-a),fn.copy(this);let c=1/a,l=1/o,u=1/s;return fn.elements[0]*=c,fn.elements[1]*=c,fn.elements[2]*=c,fn.elements[4]*=l,fn.elements[5]*=l,fn.elements[6]*=l,fn.elements[8]*=u,fn.elements[9]*=u,fn.elements[10]*=u,t.setFromRotationMatrix(fn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=et,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=et,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};i=un,i.prototype.isMatrix4=!0;var dn=new V,fn=new un,pn=new V(0,0,0),mn=new V(1,1,1),hn=new V,gn=new V,_n=new V,vn=new un,yn=new zt,bn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(_t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-_t(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(_t(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-_t(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(_t(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-_t(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:R(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return vn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(vn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return yn.setFromEuler(this),this.setFromQuaternion(yn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};bn.DEFAULT_ORDER=`XYZ`;var xn=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},Sn=0,Cn=new V,wn=new zt,Tn=new un,En=new V,Dn=new V,On=new V,kn=new zt,An=new V(1,0,0),jn=new V(0,1,0),Mn=new V(0,0,1),Nn={type:`added`},Pn={type:`removed`},Fn={type:`childadded`,child:null},In={type:`childremoved`,child:null},Ln=class e extends dt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Sn++}),this.uuid=gt(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new V,n=new bn,r=new zt,i=new V(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new un},normalMatrix:{value:new Ht}}),this.matrix=new un,this.matrixWorld=new un,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return wn.setFromAxisAngle(e,t),this.quaternion.multiply(wn),this}rotateOnWorldAxis(e,t){return wn.setFromAxisAngle(e,t),this.quaternion.premultiply(wn),this}rotateX(e){return this.rotateOnAxis(An,e)}rotateY(e){return this.rotateOnAxis(jn,e)}rotateZ(e){return this.rotateOnAxis(Mn,e)}translateOnAxis(e,t){return Cn.copy(e).applyQuaternion(this.quaternion),this.position.add(Cn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(An,e)}translateY(e){return this.translateOnAxis(jn,e)}translateZ(e){return this.translateOnAxis(Mn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Tn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?En.copy(e):En.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Dn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tn.lookAt(Dn,En,this.up):Tn.lookAt(En,Dn,this.up),this.quaternion.setFromRotationMatrix(Tn),r&&(Tn.extractRotation(r.matrixWorld),wn.setFromRotationMatrix(Tn),this.quaternion.premultiply(wn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(z(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Nn),Fn.child=e,this.dispatchEvent(Fn),Fn.child=null):z(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Pn),In.child=e,this.dispatchEvent(In),In.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Tn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Tn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Tn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Nn),Fn.child=e,this.dispatchEvent(Fn),Fn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Dn,e,On),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Dn,kn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};Ln.DEFAULT_UP=new V(0,1,0),Ln.DEFAULT_MATRIX_AUTO_UPDATE=!0,Ln.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Rn=class extends Ln{constructor(){super(),this.isGroup=!0,this.type=`Group`}},zn={type:`move`},Bn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Rn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Rn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Rn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(zn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Rn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Vn={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hn={h:0,s:0,l:0},Un={h:0,s:0,l:0};function Wn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var Gn=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=qe){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,qt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=qt.workingColorSpace){return this.r=e,this.g=t,this.b=n,qt.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=qt.workingColorSpace){if(e=vt(e,1),t=_t(t,0,1),n=_t(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Wn(i,r,e+1/3),this.g=Wn(i,r,e),this.b=Wn(i,r,e-1/3)}return qt.colorSpaceToWorking(this,r),this}setStyle(e,t=qe){function n(t){t!==void 0&&parseFloat(t)<1&&R(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:R(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);R(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=qe){let n=Vn[e.toLowerCase()];return n===void 0?R(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Jt(e.r),this.g=Jt(e.g),this.b=Jt(e.b),this}copyLinearToSRGB(e){return this.r=Yt(e.r),this.g=Yt(e.g),this.b=Yt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=qe){return qt.workingToColorSpace(Kn.copy(this),e),Math.round(_t(Kn.r*255,0,255))*65536+Math.round(_t(Kn.g*255,0,255))*256+Math.round(_t(Kn.b*255,0,255))}getHexString(e=qe){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=qt.workingColorSpace){qt.workingToColorSpace(Kn.copy(this),t);let n=Kn.r,r=Kn.g,i=Kn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=qt.workingColorSpace){return qt.workingToColorSpace(Kn.copy(this),t),e.r=Kn.r,e.g=Kn.g,e.b=Kn.b,e}getStyle(e=qe){qt.workingToColorSpace(Kn.copy(this),e);let t=Kn.r,n=Kn.g,r=Kn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Hn),this.setHSL(Hn.h+e,Hn.s+t,Hn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Hn),e.getHSL(Un);let n=xt(Hn.h,Un.h,t),r=xt(Hn.s,Un.s,t),i=xt(Hn.l,Un.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Kn=new Gn;Gn.NAMES=Vn;var qn=class extends Ln{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bn,this.environmentIntensity=1,this.environmentRotation=new bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Jn=new V,Yn=new V,Xn=new V,Zn=new V,Qn=new V,$n=new V,er=new V,tr=new V,nr=new V,rr=new V,ir=new an,ar=new an,or=new an,sr=class e{constructor(e=new V,t=new V,n=new V){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Jn.subVectors(e,t),r.cross(Jn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Jn.subVectors(r,t),Yn.subVectors(n,t),Xn.subVectors(e,t);let a=Jn.dot(Jn),o=Jn.dot(Yn),s=Jn.dot(Xn),c=Yn.dot(Yn),l=Yn.dot(Xn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Zn)!==null&&Zn.x>=0&&Zn.y>=0&&Zn.x+Zn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Zn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Zn.x),s.addScaledVector(a,Zn.y),s.addScaledVector(o,Zn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return ir.setScalar(0),ar.setScalar(0),or.setScalar(0),ir.fromBufferAttribute(e,t),ar.fromBufferAttribute(e,n),or.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(ir,i.x),a.addScaledVector(ar,i.y),a.addScaledVector(or,i.z),a}static isFrontFacing(e,t,n,r){return Jn.subVectors(n,t),Yn.subVectors(e,t),Jn.cross(Yn).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Jn.subVectors(this.c,this.b),Yn.subVectors(this.a,this.b),Jn.cross(Yn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Qn.subVectors(r,n),$n.subVectors(i,n),tr.subVectors(e,n);let s=Qn.dot(tr),c=$n.dot(tr);if(s<=0&&c<=0)return t.copy(n);nr.subVectors(e,r);let l=Qn.dot(nr),u=$n.dot(nr);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Qn,a);rr.subVectors(e,i);let f=Qn.dot(rr),p=$n.dot(rr);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector($n,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return er.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(er,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Qn,a).addScaledVector($n,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},cr=class{constructor(e=new V(1/0,1/0,1/0),t=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ur.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ur.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ur.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,ur):ur.fromBufferAttribute(r,t),ur.applyMatrix4(e.matrixWorld),this.expandByPoint(ur);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),dr.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),dr.copy(e.boundingBox)),dr.applyMatrix4(e.matrixWorld),this.union(dr)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ur),ur.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(vr),yr.subVectors(this.max,vr),fr.subVectors(e.a,vr),pr.subVectors(e.b,vr),mr.subVectors(e.c,vr),hr.subVectors(pr,fr),gr.subVectors(mr,pr),_r.subVectors(fr,mr);let t=[0,-hr.z,hr.y,0,-gr.z,gr.y,0,-_r.z,_r.y,hr.z,0,-hr.x,gr.z,0,-gr.x,_r.z,0,-_r.x,-hr.y,hr.x,0,-gr.y,gr.x,0,-_r.y,_r.x,0];return!Sr(t,fr,pr,mr,yr)||(t=[1,0,0,0,1,0,0,0,1],!Sr(t,fr,pr,mr,yr))?!1:(br.crossVectors(hr,gr),t=[br.x,br.y,br.z],Sr(t,fr,pr,mr,yr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ur).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ur).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(lr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),lr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),lr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),lr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),lr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),lr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),lr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),lr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(lr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},lr=[new V,new V,new V,new V,new V,new V,new V,new V],ur=new V,dr=new cr,fr=new V,pr=new V,mr=new V,hr=new V,gr=new V,_r=new V,vr=new V,yr=new V,br=new V,xr=new V;function Sr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){xr.fromArray(e,a);let o=i.x*Math.abs(xr.x)+i.y*Math.abs(xr.y)+i.z*Math.abs(xr.z),s=t.dot(xr),c=n.dot(xr),l=r.dot(xr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Cr=new V,wr=new B,Tr=0,Er=class extends dt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Tr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Qe,this.updateRanges=[],this.gpuType=w,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)wr.fromBufferAttribute(this,t),wr.applyMatrix3(e),this.setXY(t,wr.x,wr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Cr.fromBufferAttribute(this,t),Cr.applyMatrix3(e),this.setXYZ(t,Cr.x,Cr.y,Cr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Cr.fromBufferAttribute(this,t),Cr.applyMatrix4(e),this.setXYZ(t,Cr.x,Cr.y,Cr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Cr.fromBufferAttribute(this,t),Cr.applyNormalMatrix(e),this.setXYZ(t,Cr.x,Cr.y,Cr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Cr.fromBufferAttribute(this,t),Cr.transformDirection(e),this.setXYZ(t,Cr.x,Cr.y,Cr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=It(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Lt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=It(t,this.array)),t}setX(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=It(t,this.array)),t}setY(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=It(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=It(t,this.array)),t}setW(e,t){return this.normalized&&(t=Lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),r=Lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Lt(t,this.array),n=Lt(n,this.array),r=Lt(r,this.array),i=Lt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},Dr=class extends Er{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Or=class extends Er{constructor(e,t,n){super(new Uint32Array(e),t,n)}},kr=class extends Er{constructor(e,t,n){super(new Float32Array(e),t,n)}},Ar=new cr,jr=new V,Mr=new V,Nr=class{constructor(e=new V,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Ar.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;jr.subVectors(e,this.center);let t=jr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(jr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Mr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(jr.copy(e.center).add(Mr)),this.expandByPoint(jr.copy(e.center).sub(Mr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Pr=0,Fr=new un,Ir=new Ln,Lr=new V,Rr=new cr,zr=new cr,Br=new V,Vr=class e extends dt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pr++}),this.uuid=gt(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(tt(e)?Or:Dr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new Ht().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Fr.makeRotationFromQuaternion(e),this.applyMatrix4(Fr),this}rotateX(e){return Fr.makeRotationX(e),this.applyMatrix4(Fr),this}rotateY(e){return Fr.makeRotationY(e),this.applyMatrix4(Fr),this}rotateZ(e){return Fr.makeRotationZ(e),this.applyMatrix4(Fr),this}translate(e,t,n){return Fr.makeTranslation(e,t,n),this.applyMatrix4(Fr),this}scale(e,t,n){return Fr.makeScale(e,t,n),this.applyMatrix4(Fr),this}lookAt(e){return Ir.lookAt(e),Ir.updateMatrix(),this.applyMatrix4(Ir.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Lr).negate(),this.translate(Lr.x,Lr.y,Lr.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new kr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&R(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new cr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){z(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Rr.setFromBufferAttribute(n),this.morphTargetsRelative?(Br.addVectors(this.boundingBox.min,Rr.min),this.boundingBox.expandByPoint(Br),Br.addVectors(this.boundingBox.max,Rr.max),this.boundingBox.expandByPoint(Br)):(this.boundingBox.expandByPoint(Rr.min),this.boundingBox.expandByPoint(Rr.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&z(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Nr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){z(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new V,1/0);return}if(e){let n=this.boundingSphere.center;if(Rr.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];zr.setFromBufferAttribute(n),this.morphTargetsRelative?(Br.addVectors(Rr.min,zr.min),Rr.expandByPoint(Br),Br.addVectors(Rr.max,zr.max),Rr.expandByPoint(Br)):(Rr.expandByPoint(zr.min),Rr.expandByPoint(zr.max))}Rr.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Br.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Br));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Br.fromBufferAttribute(a,t),o&&(Lr.fromBufferAttribute(e,t),Br.add(Lr)),r=Math.max(r,n.distanceToSquared(Br))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&z(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){z(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Er(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new V,s[e]=new V;let c=new V,l=new V,u=new V,d=new B,f=new B,p=new B,m=new V,h=new V;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new V,y=new V,b=new V,x=new V;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Er(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new V,i=new V,a=new V,o=new V,s=new V,c=new V,l=new V,u=new V;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Br.fromBufferAttribute(e,t),Br.normalize(),e.setXYZ(t,Br.x,Br.y,Br.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Er(a,r,i)}if(this.index===null)return R(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Hr=new V,Ur=new V,Wr=new Ht,Gr=class{constructor(e=new V(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Hr.subVectors(n,t).cross(Ur.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Hr),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Wr.getNormalMatrix(e),r=this.coplanarPoint(Hr).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Kr=0,qr=class extends dt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Kr++}),this.uuid=gt(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Gn(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ze,this.stencilZFail=Ze,this.stencilZPass=Ze,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){R(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){R(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Gn().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Gr().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new B().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new B().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Jr=new V,Yr=new V,Xr=new V,Zr=new V,Qr=class{constructor(e=new V,t=new V(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Jr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Jr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Jr.copy(this.origin).addScaledVector(this.direction,t),Jr.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Yr.copy(e).add(t).multiplyScalar(.5),Xr.copy(t).sub(e).normalize(),Zr.copy(this.origin).sub(Yr);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Xr),o=Zr.dot(this.direction),s=-Zr.dot(Xr),c=Zr.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Yr).addScaledVector(Xr,d),f}intersectSphere(e,t){if(e.radius<0)return null;Jr.subVectors(e.center,this.origin);let n=Jr.dot(this.direction),r=Jr.dot(Jr)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Jr)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,ee,O,k,A,j,M;if(y>=b&&y>=x?(w=s,D=u,k=p,M=g,s>=0?(S=c,C=l,T=d,E=f,ee=m,O=h,A=_,j=v):(S=l,C=c,T=f,E=d,ee=h,O=m,A=v,j=_)):b>=x?(w=c,D=d,k=m,M=_,c>=0?(S=l,C=s,T=f,E=u,ee=h,O=p,A=v,j=g):(S=s,C=l,T=u,E=f,ee=p,O=h,A=g,j=v)):(w=l,D=f,k=h,M=v,l>=0?(S=s,C=c,T=u,E=d,ee=p,O=m,A=g,j=_):(S=c,C=s,T=d,E=u,ee=m,O=p,A=_,j=g)),w===0)return null;let te=S/w,N=C/w,ne=1/w,re=T-te*D,ie=E-N*D,ae=ee-te*k,oe=O-N*k,se=A-te*M,ce=j-N*M,le=se*oe-ce*ae,P=re*ce-ie*se,ue=ae*ie-oe*re;if(r){if(le<0||P<0||ue<0)return null}else if((le<0||P<0||ue<0)&&(le>0||P>0||ue>0))return null;let de=le+P+ue;if(de===0)return null;let fe=ne*(le*D+P*k+ue*M);return(de>0?fe<0:fe>0)?null:this.at(fe/de,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},$r=class extends qr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new Gn(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},ei=new un,ti=new Qr,ni=new Nr,ri=new V,ii=new V,ai=new V,oi=new V,si=new V,ci=new V,li=new V,ui=new V,di=class extends Ln{constructor(e=new Vr,t=new $r){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){ci.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(si.fromBufferAttribute(s,e),a?ci.addScaledVector(si,r):ci.addScaledVector(si.sub(t),r))}t.add(ci)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ni.copy(n.boundingSphere),ni.applyMatrix4(i),ti.copy(e.ray).recast(e.near),!(ni.containsPoint(ti.origin)===!1&&(ti.intersectSphere(ni,ri)===null||ti.origin.distanceToSquared(ri)>(e.far-e.near)**2))&&(ei.copy(i).invert(),ti.copy(e.ray).applyMatrix4(ei),(n.boundingBox===null||ti.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,ti)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=pi(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=pi(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=pi(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=pi(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function fi(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;ui.copy(s),ui.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(ui);return l<n.near||l>n.far?null:{distance:l,point:ui.clone(),object:e}}function pi(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,ii),e.getVertexPosition(c,ai),e.getVertexPosition(l,oi);let u=fi(e,t,n,r,ii,ai,oi,li);if(u){let e=new V;sr.getBarycoord(li,ii,ai,oi,e),i&&(u.uv=sr.getInterpolatedAttribute(i,s,c,l,e,new B)),a&&(u.uv1=sr.getInterpolatedAttribute(a,s,c,l,e,new B)),o&&(u.normal=sr.getInterpolatedAttribute(o,s,c,l,e,new V),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new V,materialIndex:0};sr.getNormal(ii,ai,oi,t.normal),u.face=t,u.barycoord=e}return u}var mi=class extends rn{constructor(e=null,t=1,n=1,r,i,a,o,s,c=f,l=f,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},hi=class extends Er{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},gi=new un,_i=new un,vi=[],yi=new cr,bi=new un,xi=new di,Si=new Nr,Ci=class extends di{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new hi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,bi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new cr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,gi),yi.copy(e.boundingBox).applyMatrix4(gi),this.boundingBox.union(yi)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Nr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,gi),Si.copy(e.boundingSphere).applyMatrix4(gi),this.boundingSphere.union(Si)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(xi.geometry=this.geometry,xi.material=this.material,xi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Si.copy(this.boundingSphere),Si.applyMatrix4(n),e.ray.intersectsSphere(Si)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,gi),_i.multiplyMatrices(n,gi),xi.matrixWorld=_i,xi.raycast(e,vi);for(let e=0,n=vi.length;e<n;e++){let n=vi[e];n.instanceId=i,n.object=this,t.push(n)}vi.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new hi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new mi(new Float32Array(r*this.count),r,this.count,ne,w));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},wi=new Nr,Ti=new B(.5,.5),Ei=new V,Di=class{constructor(e=new Gr,t=new Gr,n=new Gr,r=new Gr,i=new Gr,a=new Gr){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=et,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),wi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),wi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(wi)}intersectsSprite(e){return wi.center.set(0,0,0),wi.radius=.7071067811865476+Ti.distanceTo(e.center),wi.applyMatrix4(e.matrixWorld),this.intersectsSphere(wi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Ei.x=r.normal.x>0?e.max.x:e.min.x,Ei.y=r.normal.y>0?e.max.y:e.min.y,Ei.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ei)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Oi=class extends qr{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new Gn(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ki=new un,Ai=new Qr,ji=new Nr,Mi=new V,Ni=class extends Ln{constructor(e=new Vr,t=new Oi){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ji.copy(n.boundingSphere),ji.applyMatrix4(r),ji.radius+=i,e.ray.intersectsSphere(ji)===!1)return;ki.copy(r).invert(),Ai.copy(e.ray).applyMatrix4(ki);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Mi.fromBufferAttribute(l,n),Pi(Mi,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Mi.fromBufferAttribute(l,a),Pi(Mi,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Pi(e,t,n,r,i,a,o){let s=Ai.distanceSqToPoint(e);if(s<n){let n=new V;Ai.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Fi=class extends rn{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ii=class extends rn{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Li=class extends rn{constructor(e,t,n=C,r,i,a,o=f,s=f,c,l=te,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new $t(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Ri=class extends Li{constructor(e,t=C,n=301,r,i,a=f,o=f,s,c=te){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},zi=class extends rn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Bi=class e extends Vr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new kr(c,3)),this.setAttribute(`normal`,new kr(l,3)),this.setAttribute(`uv`,new kr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new V;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Vi=class e extends Vr{constructor(e=1,t=1,n=4,r=8,i=1){super(),this.type=`CapsuleGeometry`,this.parameters={radius:e,height:t,capSegments:n,radialSegments:r,heightSegments:i},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),i=Math.max(1,Math.floor(i));let a=[],o=[],s=[],c=[],l=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+i,m=r+1,h=new V,g=new V;for(let _=0;_<=p;_++){let v=0,y=0,b=0,x=0;if(_<=n){let t=_/n,r=t*Math.PI/2;y=-l-e*Math.cos(r),b=e*Math.sin(r),x=-e*Math.cos(r),v=t*u}else if(_<=n+i){let r=(_-n)/i;y=-l+r*t,b=e,x=0,v=u+r*d}else{let t=(_-n-i)/n,r=t*Math.PI/2;y=l+e*Math.sin(r),b=e*Math.cos(r),x=e*Math.sin(r),v=u+d+t*u}let S=Math.max(0,Math.min(1,v/f)),C=0;_===0?C=.5/r:_===p&&(C=-.5/r);for(let e=0;e<=r;e++){let t=e/r,n=t*Math.PI*2,i=Math.sin(n),a=Math.cos(n);g.x=-b*a,g.y=y,g.z=b*i,o.push(g.x,g.y,g.z),h.set(-b*a,x,b*i),h.normalize(),s.push(h.x,h.y,h.z),c.push(t+C,S)}if(_>0){let e=(_-1)*m;for(let t=0;t<r;t++){let n=e+t,r=e+t+1,i=_*m+t,o=_*m+t+1;a.push(n,r,i),a.push(r,o,i)}}}this.setIndex(a),this.setAttribute(`position`,new kr(o,3)),this.setAttribute(`normal`,new kr(s,3)),this.setAttribute(`uv`,new kr(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Hi=class e extends Vr{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new V,l=new B;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new kr(a,3)),this.setAttribute(`normal`,new kr(o,3)),this.setAttribute(`uv`,new kr(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Ui=class e extends Vr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new kr(u,3)),this.setAttribute(`normal`,new kr(d,3)),this.setAttribute(`uv`,new kr(f,2));function _(){let a=new V,_=new V,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new B,m=new V,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Wi=class e extends Ui{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Gi=class e extends Vr{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new kr(i,3)),this.setAttribute(`normal`,new kr(i.slice(),3)),this.setAttribute(`uv`,new kr(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new V,r=new V,i=new V;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new V;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new V;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new V,t=new V,n=new V,r=new V,o=new B,s=new B,c=new B;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},Ki=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){R(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new B:new V);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new V,r=[],i=[],a=[],o=new V,s=new un;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new V)}i[0]=new V,a[0]=new V;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(_t(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(_t(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},qi=class extends Ki{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new B){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ji=class extends qi{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function Yi(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Xi=new V,Zi=new V,Qi=new Yi,$i=new Yi,ea=new Yi,ta=class extends Ki{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new V){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Zi.subVectors(r[0],r[1]).add(r[0]),c=Zi);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Xi.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Xi),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Qi.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),$i.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),ea.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Qi.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),$i.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),ea.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Qi.calc(s),$i.calc(s),ea.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new V().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function na(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function ra(e,t){let n=1-e;return n*n*t}function ia(e,t){return 2*(1-e)*e*t}function aa(e,t){return e*e*t}function oa(e,t,n,r){return ra(e,t)+ia(e,n)+aa(e,r)}function sa(e,t){let n=1-e;return n*n*n*t}function ca(e,t){let n=1-e;return 3*n*n*e*t}function la(e,t){return 3*(1-e)*e*e*t}function ua(e,t){return e*e*e*t}function da(e,t,n,r,i){return sa(e,t)+ca(e,n)+la(e,r)+ua(e,i)}var fa=class extends Ki{constructor(e=new B,t=new B,n=new B,r=new B){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new B){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(da(e,r.x,i.x,a.x,o.x),da(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},pa=class extends Ki{constructor(e=new V,t=new V,n=new V,r=new V){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new V){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(da(e,r.x,i.x,a.x,o.x),da(e,r.y,i.y,a.y,o.y),da(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ma=class extends Ki{constructor(e=new B,t=new B){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new B){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new B){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ha=class extends Ki{constructor(e=new V,t=new V){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new V){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new V){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ga=class extends Ki{constructor(e=new B,t=new B,n=new B){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new B){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(oa(e,r.x,i.x,a.x),oa(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},_a=class extends Ki{constructor(e=new V,t=new V,n=new V){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new V){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(oa(e,r.x,i.x,a.x),oa(e,r.y,i.y,a.y),oa(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},va=class extends Ki{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new B){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(na(o,s.x,c.x,l.x,u.x),na(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new B().fromArray(n))}return this}},ya=Object.freeze({__proto__:null,ArcCurve:Ji,CatmullRomCurve3:ta,CubicBezierCurve:fa,CubicBezierCurve3:pa,EllipseCurve:qi,LineCurve:ma,LineCurve3:ha,QuadraticBezierCurve:ga,QuadraticBezierCurve3:_a,SplineCurve:va}),ba=class extends Ki{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new ya[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new ya[n.type]().fromJSON(n))}return this}},xa=class extends ba{constructor(e){super(),this.type=`Path`,this.currentPoint=new B,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ma(this.currentPoint.clone(),new B(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new ga(this.currentPoint.clone(),new B(e,t),new B(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new fa(this.currentPoint.clone(),new B(e,t),new B(n,r),new B(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new va([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new qi(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Sa=class extends xa{constructor(e){super(e),this.uuid=gt(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new xa().fromJSON(n))}return this}};function Ca(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=wa(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=ja(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return Ea(a,o,n,s,c,l,0),o}function wa(e,t,n,r,i){let a;if(i===to(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=Qa(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=Qa(i/r|0,e[i],e[i+1],a);return a&&Wa(a,a.next)&&($a(a),a=a.next),a}function Ta(e,t){if(!e)return e;t||(t=e);let n=e,r;do if(r=!1,!n.steiner&&(Wa(n,n.next)||Ua(n.prev,n,n.next)===0)){if($a(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function Ea(e,t,n,r,i,a,o){if(!e)return;!o&&a&&Ia(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?Oa(e,r,i,a):Da(e)){t.push(c.i,e.i,l.i),$a(e),e=l.next,s=l.next;continue}if(e=l,e===s){o?o===1?(e=ka(Ta(e),t),Ea(e,t,n,r,i,a,2)):o===2&&Aa(e,t,n,r,i,a):Ea(Ta(e),t,n,r,i,a,1);break}}}function Da(e){let t=e.prev,n=e,r=e.next;if(Ua(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&Va(i,s,a,c,o,l,m.x,m.y)&&Ua(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Oa(e,t,n,r){let i=e.prev,a=e,o=e.next;if(Ua(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=Ra(p,m,t,n,r),v=Ra(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Va(s,u,c,d,l,f,y.x,y.y)&&Ua(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Va(s,u,c,d,l,f,b.x,b.y)&&Ua(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Va(s,u,c,d,l,f,y.x,y.y)&&Ua(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Va(s,u,c,d,l,f,b.x,b.y)&&Ua(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function ka(e,t){let n=e;do{let r=n.prev,i=n.next.next;!Wa(r,i)&&Ga(r,n,n.next,i)&&Ya(r,i)&&Ya(i,r)&&(t.push(r.i,n.i,i.i),$a(n),$a(n.next),n=e=i),n=n.next}while(n!==e);return Ta(n)}function Aa(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&Ha(o,e)){let s=Za(o,e);o=Ta(o,o.next),s=Ta(s,s.next),Ea(o,t,n,r,i,a,0),Ea(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function ja(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=wa(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(za(o))}i.sort(Ma);for(let e=0;e<i.length;e++)n=Na(i[e],n);return n}function Ma(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function Na(e,t){let n=Pa(e,t);if(!n)return t;let r=Za(n,e);return Ta(r,r.next),Ta(n,n.next)}function Pa(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(Wa(e,n))return n;do{if(Wa(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&Ba(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);Ya(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&Fa(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function Fa(e,t){return Ua(e.prev,e,t.prev)<0&&Ua(t.next,e,e.next)<0}function Ia(e,t,n,r){let i=e;do i.z===0&&(i.z=Ra(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,La(i)}function La(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function Ra(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function za(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function Ba(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function Va(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&Ba(e,t,n,r,i,a,o,s)}function Ha(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!Ja(e,t)&&(Ya(e,t)&&Ya(t,e)&&Xa(e,t)&&(Ua(e.prev,e,t.prev)||Ua(e,t.prev,t))||Wa(e,t)&&Ua(e.prev,e,e.next)>0&&Ua(t.prev,t,t.next)>0)}function Ua(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function Wa(e,t){return e.x===t.x&&e.y===t.y}function Ga(e,t,n,r){let i=qa(Ua(e,t,n)),a=qa(Ua(e,t,r)),o=qa(Ua(n,r,e)),s=qa(Ua(n,r,t));return!!(i!==a&&o!==s||i===0&&Ka(e,n,t)||a===0&&Ka(e,r,t)||o===0&&Ka(n,e,r)||s===0&&Ka(n,t,r))}function Ka(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function qa(e){return e>0?1:e<0?-1:0}function Ja(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&Ga(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function Ya(e,t){return Ua(e.prev,e,e.next)<0?Ua(e,t,e.next)>=0&&Ua(e,e.prev,t)>=0:Ua(e,t,e.prev)<0||Ua(e,e.next,t)<0}function Xa(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Za(e,t){let n=eo(e.i,e.x,e.y),r=eo(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function Qa(e,t,n,r){let i=eo(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function $a(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function eo(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function to(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var no=class{static triangulate(e,t,n=2){return Ca(e,t,n)}},ro=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];io(e),ao(n,e);let a=e.length;t.forEach(io);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,ao(n,t[e]);let o=no.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function io(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function ao(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var oo=class e extends Vr{constructor(e=new Sa([new B(.5,.5),new B(-.5,.5),new B(-.5,-.5),new B(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new kr(r,3)),this.setAttribute(`uv`,new kr(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?so:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new V,b=new V,x=new V}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!ro.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];ro.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));if(s<=10000000000000001e-36*c*c){e.splice(r,1),n--;continue}t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function ee(e,t,n){return t||z(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let O=C.length;function k(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new B(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new B(r/a,i/a)}let A=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),A[e]=k(D[e],D[n],D[r]);let j=[],M,te=A.concat();for(let e=0,t=E;e<t;e++){let t=w[e];M=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),M[e]=k(t[e],t[r],t[i]);j.push(M),te=te.concat(M)}let N;if(p===0)N=ro.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=ee(D[t],A[t],a);se(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];M=j[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=ee(n[e],M[e],a);se(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}N=ro.triangulateShape(e,t)}let ne=N.length,re=d+f;for(let e=0;e<O;e++){let t=l?ee(C[e],te[e],re):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),se(x.x,x.y,x.z)):se(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<O;t++){let n=l?ee(C[t],te[t],re):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),se(x.x,x.y,x.z)):se(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=ee(D[e],A[e],r);se(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];M=j[e];for(let e=0,i=t.length;e<i;e++){let i=ee(t[e],M[e],r);_?se(i.x,i.y+g[s-1].y,g[s-1].x+n):se(i.x,i.y,c+n)}}}ie(),ae();function ie(){let e=r.length/3;if(l){let e=0,t=O*e;for(let e=0;e<ne;e++){let n=N[e];ce(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=O*e;for(let e=0;e<ne;e++){let n=N[e];ce(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<ne;e++){let t=N[e];ce(t[2],t[1],t[0])}for(let e=0;e<ne;e++){let t=N[e];ce(t[0]+O*s,t[1]+O*s,t[2]+O*s)}}n.addGroup(e,r.length/3-e,0)}function ae(){let e=r.length/3,t=0;oe(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];oe(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function oe(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=O*e,a=O*(e+1);le(t+r+n,t+i+n,t+i+a,t+r+a)}}}function se(e,t,n){a.push(e),a.push(t),a.push(n)}function ce(e,t,i){P(e),P(t),P(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);ue(o[0]),ue(o[1]),ue(o[2])}function le(e,t,i,a){P(e),P(t),P(a),P(t),P(i),P(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);ue(s[0]),ue(s[1]),ue(s[3]),ue(s[1]),ue(s[2]),ue(s[3])}function P(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function ue(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return co(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new ya[i.type]().fromJSON(i)),new e(r,t.options)}},so={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new B(a,o),new B(s,c),new B(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new B(o,1-c),new B(l,1-d),new B(f,1-m),new B(h,1-_)]:[new B(s,1-c),new B(u,1-d),new B(p,1-m),new B(g,1-_)]}};function co(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var lo=class e extends Gi{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},uo=class e extends Gi{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type=`OctahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},fo=class e extends Vr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new kr(p,3)),this.setAttribute(`normal`,new kr(m,3)),this.setAttribute(`uv`,new kr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},po=class e extends Vr{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new V,p=new B;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new kr(s,3)),this.setAttribute(`normal`,new kr(c,3)),this.setAttribute(`uv`,new kr(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},mo=class e extends Vr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new V,d=new V,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new kr(p,3)),this.setAttribute(`normal`,new kr(m,3)),this.setAttribute(`uv`,new kr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},ho=class e extends Vr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new V,f=new V,p=new V;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new kr(c,3)),this.setAttribute(`normal`,new kr(l,3)),this.setAttribute(`uv`,new kr(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function go(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(vo(i))i.isRenderTargetTexture?(R(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(vo(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function _o(e){let t={};for(let n=0;n<e.length;n++){let r=go(e[n]);for(let e in r)t[e]=r[e]}return t}function vo(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function yo(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function bo(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:qt.workingColorSpace}var xo={clone:go,merge:_o},So=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Co=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,wo=class extends qr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=So,this.fragmentShader=Co,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=go(e.uniforms),this.uniformsGroups=yo(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new Gn().setHex(r.value);break;case`v2`:this.uniforms[n].value=new B().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new V().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new an().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new Ht().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new un().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},To=class extends wo{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Eo=class extends qr{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new Gn(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gn(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new B(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Do=class extends qr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Ke,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Oo=class extends qr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function ko(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Ao(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var jo=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Mo=class extends jo{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ue,endingEnd:Ue}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case We:i=e,o=2*t-n;break;case Ge:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case We:a=e,s=2*n-t;break;case Ge:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},No=class extends jo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Po=class extends jo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Fo=class extends jo{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Ro(n,t,g,y,r);i[p]=Io(x,o,_,b,m)}return i}};function Io(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Lo(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Ro(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Io(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Lo(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var zo=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=ko(t,this.TimeBufferType),this.values=ko(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ko(e.times,Array),values:ko(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Ao(e.settings)&&(n.settings={inTangents:ko(e.settings.inTangents,Array),outTangents:ko(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Po(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new No(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Mo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Fo(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case ze:t=this.InterpolantFactoryMethodDiscrete;break;case Be:t=this.InterpolantFactoryMethodLinear;break;case Ve:t=this.InterpolantFactoryMethodSmooth;break;case He:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return R(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ze;case this.InterpolantFactoryMethodLinear:return Be;case this.InterpolantFactoryMethodSmooth:return Ve;case this.InterpolantFactoryMethodBezier:return He}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Ao(this.settings)&&(Bo(this.settings.inTangents,e),Bo(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(z(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(z(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){z(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){z(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&nt(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){z(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Ve,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Ao(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Bo(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}zo.prototype.ValueTypeName=``,zo.prototype.TimeBufferType=Float32Array,zo.prototype.ValueBufferType=Float32Array,zo.prototype.DefaultInterpolation=Be;var Vo=class extends zo{constructor(e,t,n){super(e,t,n)}};Vo.prototype.ValueTypeName=`bool`,Vo.prototype.ValueBufferType=Array,Vo.prototype.DefaultInterpolation=ze,Vo.prototype.InterpolantFactoryMethodLinear=void 0,Vo.prototype.InterpolantFactoryMethodSmooth=void 0;var Ho=class extends zo{constructor(e,t,n,r){super(e,t,n,r)}};Ho.prototype.ValueTypeName=`color`;var Uo=class extends zo{constructor(e,t,n,r){super(e,t,n,r)}};Uo.prototype.ValueTypeName=`number`;var Wo=class extends jo{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)zt.slerpFlat(i,0,a,c-o,a,c,s);return i}},Go=class extends zo{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Wo(this.times,this.values,this.getValueSize(),e)}};Go.prototype.ValueTypeName=`quaternion`,Go.prototype.InterpolantFactoryMethodSmooth=void 0;var Ko=class extends zo{constructor(e,t,n){super(e,t,n)}};Ko.prototype.ValueTypeName=`string`,Ko.prototype.ValueBufferType=Array,Ko.prototype.DefaultInterpolation=ze,Ko.prototype.InterpolantFactoryMethodLinear=void 0,Ko.prototype.InterpolantFactoryMethodSmooth=void 0;var qo=class extends zo{constructor(e,t,n,r){super(e,t,n,r)}};qo.prototype.ValueTypeName=`vector`;var Jo=class extends Ln{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new Gn(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Yo=class extends Jo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(Ln.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Gn(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Xo=new un,Zo=new V,Qo=new V,$o=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new B(512,512),this.mapType=v,this.map=null,this.mapPass=null,this.matrix=new un,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Di,this._frameExtents=new B(1,1),this._viewportCount=1,this._viewports=[new an(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Zo.setFromMatrixPosition(e.matrixWorld),t.position.copy(Zo),Qo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Qo),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Xo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Xo,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Xo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},es=new V,ts=new zt,ns=new V,rs=class extends Ln{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new un,this.projectionMatrix=new un,this.projectionMatrixInverse=new un,this.coordinateSystem=et,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(es,ts,ns),ns.x===1&&ns.y===1&&ns.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(es,ts,ns.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(es,ts,ns),ns.x===1&&ns.y===1&&ns.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(es,ts,ns.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},is=new V,as=new B,os=new B,ss=class extends rs{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ht*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(mt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ht*2*Math.atan(Math.tan(mt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){is.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(is.x,is.y).multiplyScalar(-e/is.z),is.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(is.x,is.y).multiplyScalar(-e/is.z)}getViewSize(e,t){return this.getViewBounds(e,as,os),t.subVectors(os,as)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(mt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},cs=class extends rs{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ls=class extends $o{constructor(){super(new cs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},us=class extends Jo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Ln.DEFAULT_UP),this.updateMatrix(),this.target=new Ln,this.shadow=new ls}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},ds=-90,fs=1,ps=class extends Ln{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new ss(ds,fs,e,t);r.layers=this.layers,this.add(r);let i=new ss(ds,fs,e,t);i.layers=this.layers,this.add(i);let a=new ss(ds,fs,e,t);a.layers=this.layers,this.add(a);let o=new ss(ds,fs,e,t);o.layers=this.layers,this.add(o);let s=new ss(ds,fs,e,t);s.layers=this.layers,this.add(s);let c=new ss(ds,fs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},ms=class extends ss{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},hs=`\\[\\]\\.:\\/`,gs=RegExp(`[\\[\\]\\.:\\/]`,`g`),_s=`[^\\[\\]\\.:\\/]`,vs=`[^`+hs.replace(`\\.`,``)+`]`,ys=`((?:WC+[\\/:])*)`.replace(`WC`,_s),bs=`(WCOD+)?`.replace(`WCOD`,vs),xs=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,_s),Ss=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,_s),Cs=RegExp(`^`+ys+bs+xs+Ss+`$`),ws=[`material`,`materials`,`bones`,`map`],Ts=class{constructor(e,t,n){let r=n||Es.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Es=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(gs,``)}static parseTrackName(e){let t=Cs.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);ws.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){R(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){z(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){z(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){z(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){z(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){z(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){z(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){z(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;z(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){z(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){z(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Es.Composite=Ts,Es.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Es.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Es.prototype.GetterByBindingType=[Es.prototype._getValue_direct,Es.prototype._getValue_array,Es.prototype._getValue_arrayElement,Es.prototype._getValue_toArray],Es.prototype.SetterByBindingTypeAndVersioning=[[Es.prototype._setValue_direct,Es.prototype._setValue_direct_setNeedsUpdate,Es.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Es.prototype._setValue_array,Es.prototype._setValue_array_setNeedsUpdate,Es.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Es.prototype._setValue_arrayElement,Es.prototype._setValue_arrayElement_setNeedsUpdate,Es.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Es.prototype._setValue_fromArray,Es.prototype._setValue_fromArray_setNeedsUpdate,Es.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],a=class{constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}},a.prototype.isMatrix2=!0;function Ds(e,t,n,r){let i=Os(r);switch(n){case A:return e*t;case ne:return e*t/i.components*i.byteLength;case re:return e*t/i.components*i.byteLength;case ie:return e*t*2/i.components*i.byteLength;case ae:return e*t*2/i.components*i.byteLength;case j:return e*t*3/i.components*i.byteLength;case M:return e*t*4/i.components*i.byteLength;case oe:return e*t*4/i.components*i.byteLength;case se:case ce:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case le:case P:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case de:case pe:return Math.max(e,16)*Math.max(t,8)/4;case ue:case fe:return Math.max(e,8)*Math.max(t,8)/2;case me:case he:case _e:case ve:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ge:case ye:case be:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case xe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Se:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Ce:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case we:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Te:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Ee:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case De:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Oe:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case ke:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Ae:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case je:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Me:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ne:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case F:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Pe:case Fe:case Ie:return Math.ceil(e/4)*Math.ceil(t/4)*16;case I:case Le:return Math.ceil(e/4)*Math.ceil(t/4)*8;case L:case Re:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Os(e){switch(e){case v:case y:return{byteLength:1,components:1};case x:case b:case T:return{byteLength:2,components:1};case E:case D:return{byteLength:2,components:4};case C:case S:case w:return{byteLength:4,components:1};case O:case k:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?R(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function ks(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function As(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var js={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},H={common:{diffuse:{value:new Gn(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ht}},envmap:{envMap:{value:null},envMapRotation:{value:new Ht},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ht}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ht}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ht},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ht},normalScale:{value:new B(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ht},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ht}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ht}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ht}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Gn(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new V},probesMax:{value:new V},probesResolution:{value:new V}},points:{diffuse:{value:new Gn(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0},uvTransform:{value:new Ht}},sprite:{diffuse:{value:new Gn(16777215)},opacity:{value:1},center:{value:new B(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}}},Ms={basic:{uniforms:_o([H.common,H.specularmap,H.envmap,H.aomap,H.lightmap,H.fog]),vertexShader:js.meshbasic_vert,fragmentShader:js.meshbasic_frag},lambert:{uniforms:_o([H.common,H.specularmap,H.envmap,H.aomap,H.lightmap,H.emissivemap,H.bumpmap,H.normalmap,H.displacementmap,H.fog,H.lights,{emissive:{value:new Gn(0)},envMapIntensity:{value:1}}]),vertexShader:js.meshlambert_vert,fragmentShader:js.meshlambert_frag},phong:{uniforms:_o([H.common,H.specularmap,H.envmap,H.aomap,H.lightmap,H.emissivemap,H.bumpmap,H.normalmap,H.displacementmap,H.fog,H.lights,{emissive:{value:new Gn(0)},specular:{value:new Gn(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:js.meshphong_vert,fragmentShader:js.meshphong_frag},standard:{uniforms:_o([H.common,H.envmap,H.aomap,H.lightmap,H.emissivemap,H.bumpmap,H.normalmap,H.displacementmap,H.roughnessmap,H.metalnessmap,H.fog,H.lights,{emissive:{value:new Gn(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:js.meshphysical_vert,fragmentShader:js.meshphysical_frag},toon:{uniforms:_o([H.common,H.aomap,H.lightmap,H.emissivemap,H.bumpmap,H.normalmap,H.displacementmap,H.gradientmap,H.fog,H.lights,{emissive:{value:new Gn(0)}}]),vertexShader:js.meshtoon_vert,fragmentShader:js.meshtoon_frag},matcap:{uniforms:_o([H.common,H.bumpmap,H.normalmap,H.displacementmap,H.fog,{matcap:{value:null}}]),vertexShader:js.meshmatcap_vert,fragmentShader:js.meshmatcap_frag},points:{uniforms:_o([H.points,H.fog]),vertexShader:js.points_vert,fragmentShader:js.points_frag},dashed:{uniforms:_o([H.common,H.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:js.linedashed_vert,fragmentShader:js.linedashed_frag},depth:{uniforms:_o([H.common,H.displacementmap]),vertexShader:js.depth_vert,fragmentShader:js.depth_frag},normal:{uniforms:_o([H.common,H.bumpmap,H.normalmap,H.displacementmap,{opacity:{value:1}}]),vertexShader:js.meshnormal_vert,fragmentShader:js.meshnormal_frag},sprite:{uniforms:_o([H.sprite,H.fog]),vertexShader:js.sprite_vert,fragmentShader:js.sprite_frag},background:{uniforms:{uvTransform:{value:new Ht},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:js.background_vert,fragmentShader:js.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ht}},vertexShader:js.backgroundCube_vert,fragmentShader:js.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:js.cube_vert,fragmentShader:js.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:js.equirect_vert,fragmentShader:js.equirect_frag},distance:{uniforms:_o([H.common,H.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:js.distance_vert,fragmentShader:js.distance_frag},shadow:{uniforms:_o([H.lights,H.fog,{color:{value:new Gn(0)},opacity:{value:1}}]),vertexShader:js.shadow_vert,fragmentShader:js.shadow_frag}};Ms.physical={uniforms:_o([Ms.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ht},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ht},clearcoatNormalScale:{value:new B(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ht},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ht},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ht},sheen:{value:0},sheenColor:{value:new Gn(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ht},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ht},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ht},transmissionSamplerSize:{value:new B},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ht},attenuationDistance:{value:0},attenuationColor:{value:new Gn(0)},specularColor:{value:new Gn(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ht},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ht},anisotropyVector:{value:new B},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ht}}]),vertexShader:js.meshphysical_vert,fragmentShader:js.meshphysical_frag};var Ns={r:0,b:0,g:0},Ps=new un,Fs=new Ht;Fs.set(-1,0,0,0,1,0,0,0,1);function Is(e,t,n,r,i,a){let o=new Gn(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new di(new Bi(1,1,1),new wo({name:`BackgroundCubeMaterial`,uniforms:go(Ms.backgroundCube.uniforms),vertexShader:Ms.backgroundCube.vertexShader,fragmentShader:Ms.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Ps.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Fs),l.material.toneMapped=qt.getTransfer(i.colorSpace)!==Xe,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new di(new fo(2,2),new wo({name:`BackgroundMaterial`,uniforms:go(Ms.background.uniforms),vertexShader:Ms.background.vertexShader,fragmentShader:Ms.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=qt.getTransfer(i.colorSpace)!==Xe,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Ns,bo(e)),n.buffers.color.setClear(Ns.r,Ns.g,Ns.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Ls(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Rs(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function zs(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(R(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&R(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Bs(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Gr,s=new Ht,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Vs=4,Hs=6,Us=20,Ws=256,Gs=new cs,Ks=new Gn,qs=null,Js=0,Ys=0,Xs=!1,Zs=new V,Qs=new V,$s=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Zs}=i;qs=this._renderer.getRenderTarget(),Js=this._renderer.getActiveCubeFace(),Ys=this._renderer.getActiveMipmapLevel(),Xs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=oc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ac(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(qs,Js,Ys),this._renderer.xr.enabled=Xs,e.scissorTest=!1,nc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),qs=this._renderer.getRenderTarget(),Js=this._renderer.getActiveCubeFace(),Ys=this._renderer.getActiveMipmapLevel(),Xs=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:h,minFilter:h,generateMipmaps:!1,type:T,format:M,colorSpace:Je,depthBuffer:!1},r=tc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=tc(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=ec(r)),this._blurMaterial=ic(r,e,t),this._ggxMaterial=rc(r,e,t)}return r}_compileMaterial(e){let t=new di(new Vr,e);this._renderer.compile(t,Gs)}_sceneToCubeUV(e,t,n,r,i){let a=new ss(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Ks),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new di(new Bi,new $r({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Ks),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;nc(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=oc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ac());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;nc(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Gs)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Vs?n-d+Vs:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,nc(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Gs),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,nc(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Gs)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];nc(t,3*l*(r>this._lodMax-Vs?r-this._lodMax+Vs:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Gs)}};function ec(e){let t=[],n=[],r=e,i=e-Vs+1+Hs;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?Qs.set(1,r,n):e===1?Qs.set(-n,1,-r):e===2?Qs.set(-n,r,1):e===3?Qs.set(-1,r,-n):e===4?Qs.set(-n,-1,r):Qs.set(n,r,-1),Qs.toArray(l,(e*6+t)*3)}}let u=new Vr;u.setAttribute(`position`,new Er(c,3)),u.setAttribute(`outputDirection`,new Er(l,3)),n.push(new di(u,null)),r>Vs&&r--}return{lodMeshes:n,sizeLods:t}}function tc(e,t,n){let r=new sn(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function nc(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function rc(e,t,n){return new wo({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Ws,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:sc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ic(e,t,n){return new wo({name:`SphericalGaussianBlur`,defines:{SAMPLES:Us,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:sc(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ac(){return new wo({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:sc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function oc(){return new wo({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:sc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function sc(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var cc=class extends sn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Fi(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Bi(5,5,5),i=new wo({name:`CubemapFromEquirect`,uniforms:go(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new di(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=h),new ps(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function lc(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new cc(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new $s(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new $s(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function uc(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&ct(`WebGLRenderer: `+e+` extension not supported.`),t}}}function dc(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?Or:Dr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function fc(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function pc(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:z(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function mc(e,t,n){let r=new WeakMap,i=new an;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new cn(h,p,m,u);g.type=w,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new B(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function hc(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var gc={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function _c(e,t,n,r,i,a){let o=new sn(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Vr;l.setAttribute(`position`,new kr([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new kr([0,2,0,0,2,0],2));let u=new To({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new di(l,u),f=new cs(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new sn(t,n,{type:T,depthBuffer:!1,stencilBuffer:!1}),c=new sn(t,n,{type:T,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},qt.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=gc[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var vc=new rn,yc=new Li(1,1),bc=new cn,xc=new ln,Sc=new Fi,Cc=[],wc=[],Tc=new Float32Array(16),Ec=new Float32Array(9),Dc=new Float32Array(4);function Oc(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Cc[i];if(a===void 0&&(a=new Float32Array(i),Cc[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function kc(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Ac(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function jc(e,t){let n=wc[t];n===void 0&&(n=new Int32Array(t),wc[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Mc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Nc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(kc(n,t))return;e.uniform2fv(this.addr,t),Ac(n,t)}}function Pc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(kc(n,t))return;e.uniform3fv(this.addr,t),Ac(n,t)}}function Fc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(kc(n,t))return;e.uniform4fv(this.addr,t),Ac(n,t)}}function Ic(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(kc(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Ac(n,t)}else{if(kc(n,r))return;Dc.set(r),e.uniformMatrix2fv(this.addr,!1,Dc),Ac(n,r)}}function Lc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(kc(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Ac(n,t)}else{if(kc(n,r))return;Ec.set(r),e.uniformMatrix3fv(this.addr,!1,Ec),Ac(n,r)}}function Rc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(kc(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Ac(n,t)}else{if(kc(n,r))return;Tc.set(r),e.uniformMatrix4fv(this.addr,!1,Tc),Ac(n,r)}}function zc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Bc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(kc(n,t))return;e.uniform2iv(this.addr,t),Ac(n,t)}}function Vc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(kc(n,t))return;e.uniform3iv(this.addr,t),Ac(n,t)}}function Hc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(kc(n,t))return;e.uniform4iv(this.addr,t),Ac(n,t)}}function Uc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Wc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(kc(n,t))return;e.uniform2uiv(this.addr,t),Ac(n,t)}}function Gc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(kc(n,t))return;e.uniform3uiv(this.addr,t),Ac(n,t)}}function Kc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(kc(n,t))return;e.uniform4uiv(this.addr,t),Ac(n,t)}}function qc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(yc.compareFunction=n.isReversedDepthBuffer()?518:515,a=yc):a=vc,n.setTexture2D(t||a,i)}function Jc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||xc,i)}function Yc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Sc,i)}function Xc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||bc,i)}function Zc(e){switch(e){case 5126:return Mc;case 35664:return Nc;case 35665:return Pc;case 35666:return Fc;case 35674:return Ic;case 35675:return Lc;case 35676:return Rc;case 5124:case 35670:return zc;case 35667:case 35671:return Bc;case 35668:case 35672:return Vc;case 35669:case 35673:return Hc;case 5125:return Uc;case 36294:return Wc;case 36295:return Gc;case 36296:return Kc;case 35678:case 36198:case 36298:case 36306:case 35682:return qc;case 35679:case 36299:case 36307:return Jc;case 35680:case 36300:case 36308:case 36293:return Yc;case 36289:case 36303:case 36311:case 36292:return Xc}}function Qc(e,t){e.uniform1fv(this.addr,t)}function $c(e,t){let n=Oc(t,this.size,2);e.uniform2fv(this.addr,n)}function el(e,t){let n=Oc(t,this.size,3);e.uniform3fv(this.addr,n)}function tl(e,t){let n=Oc(t,this.size,4);e.uniform4fv(this.addr,n)}function nl(e,t){let n=Oc(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function rl(e,t){let n=Oc(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function il(e,t){let n=Oc(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function al(e,t){e.uniform1iv(this.addr,t)}function ol(e,t){e.uniform2iv(this.addr,t)}function sl(e,t){e.uniform3iv(this.addr,t)}function cl(e,t){e.uniform4iv(this.addr,t)}function ll(e,t){e.uniform1uiv(this.addr,t)}function ul(e,t){e.uniform2uiv(this.addr,t)}function dl(e,t){e.uniform3uiv(this.addr,t)}function fl(e,t){e.uniform4uiv(this.addr,t)}function pl(e,t,n){let r=this.cache,i=t.length,a=jc(n,i);kc(r,a)||(e.uniform1iv(this.addr,a),Ac(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?yc:vc;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function ml(e,t,n){let r=this.cache,i=t.length,a=jc(n,i);kc(r,a)||(e.uniform1iv(this.addr,a),Ac(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||xc,a[e])}function hl(e,t,n){let r=this.cache,i=t.length,a=jc(n,i);kc(r,a)||(e.uniform1iv(this.addr,a),Ac(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Sc,a[e])}function gl(e,t,n){let r=this.cache,i=t.length,a=jc(n,i);kc(r,a)||(e.uniform1iv(this.addr,a),Ac(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||bc,a[e])}function _l(e){switch(e){case 5126:return Qc;case 35664:return $c;case 35665:return el;case 35666:return tl;case 35674:return nl;case 35675:return rl;case 35676:return il;case 5124:case 35670:return al;case 35667:case 35671:return ol;case 35668:case 35672:return sl;case 35669:case 35673:return cl;case 5125:return ll;case 36294:return ul;case 36295:return dl;case 36296:return fl;case 35678:case 36198:case 36298:case 36306:case 35682:return pl;case 35679:case 36299:case 36307:return ml;case 35680:case 36300:case 36308:case 36293:return hl;case 36289:case 36303:case 36311:case 36292:return gl}}var vl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Zc(t.type)}},yl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=_l(t.type)}},bl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},xl=/(\w+)(\])?(\[|\.)?/g;function Sl(e,t){e.seq.push(t),e.map[t.id]=t}function Cl(e,t,n){let r=e.name,i=r.length;for(xl.lastIndex=0;;){let a=xl.exec(r),o=xl.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Sl(n,l===void 0?new vl(s,e,t):new yl(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new bl(s),Sl(n,e)),n=e}}}var wl=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Cl(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Tl(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var El=37297,Dl=0;function Ol(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var kl=new Ht;function Al(e){qt._getMatrix(kl,qt.workingColorSpace,e);let t=`mat3( ${kl.elements.map(e=>e.toFixed(4))} )`;switch(qt.getTransfer(e)){case Ye:return[t,`LinearTransferOETF`];case Xe:return[t,`sRGBTransferOETF`];default:return R(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function jl(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Ol(e.getShaderSource(t),r)}return i}function Ml(e,t){let n=Al(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Nl={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Pl(e,t){let n=Nl[t];return n===void 0?(R(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Fl=new V;function Il(){return qt.getLuminanceCoefficients(Fl),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Fl.x.toFixed(4)}, ${Fl.y.toFixed(4)}, ${Fl.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Ll(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Bl).join(`
`)}function Rl(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function zl(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Bl(e){return e!==``}function Vl(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Hl(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Ul=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wl(e){return e.replace(Ul,Kl)}var Gl=new Map;function Kl(e,t){let n=js[t];if(n===void 0){let e=Gl.get(t);if(e!==void 0)n=js[e],R(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Wl(n)}var ql=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jl(e){return e.replace(ql,Yl)}function Yl(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Xl(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Zl={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Ql(e){return Zl[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var $l={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function eu(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:$l[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var tu={302:`ENVMAP_MODE_REFRACTION`};function nu(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:tu[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var ru={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function iu(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:ru[e.combine]||`ENVMAP_BLENDING_NONE`}function au(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function ou(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Ql(n),l=eu(n),u=nu(n),d=iu(n),f=au(n),p=Ll(n),m=Rl(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Bl).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Bl).join(`
`),_.length>0&&(_+=`
`)):(g=[Xl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Bl).join(`
`),_=[Xl(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:js.tonemapping_pars_fragment,n.toneMapping===0?``:Pl(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,js.colorspace_pars_fragment,Ml(`linearToOutputTexel`,n.outputColorSpace),Il(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Bl).join(`
`)),o=Wl(o),o=Vl(o,n),o=Hl(o,n),s=Wl(s),s=Vl(s,n),s=Hl(s,n),o=Jl(o),s=Jl(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Tl(i,i.VERTEX_SHADER,y),S=Tl(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=jl(i,x,`vertex`),n=jl(i,S,`fragment`);z(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):R(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new wl(i,h),T=zl(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,El)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Dl++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var su=0,cu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new lu(e),t.set(e,n)),n}},lu=class{constructor(e){this.id=su++,this.code=e,this.usedTimes=0}};function uu(e){return e===1030||e===37490||e===36285}function du(e,t,n,r,i,a){let o=new xn,s=new cu,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&R(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,ee,O,k;if(C){let e=Ms[C];D=e.vertexShader,ee=e.fragmentShader}else{D=i.vertexShader,ee=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let A=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),M=h.isInstancedMesh===!0,te=h.isBatchedMesh===!0,N=!!i.map,ne=!!i.matcap,re=!!x,ie=!!i.aoMap,ae=!!i.lightMap,oe=!!i.bumpMap&&i.wireframe===!1,se=!!i.normalMap,ce=!!i.displacementMap,le=!!i.emissiveMap,P=!!i.metalnessMap,ue=!!i.roughnessMap,de=i.anisotropy>0,fe=i.clearcoat>0,pe=i.dispersion>0,me=i.retroreflectivity>0,he=i.iridescence>0,ge=i.sheen>0,_e=i.transmission>0,ve=de&&!!i.anisotropyMap,ye=fe&&!!i.clearcoatMap,be=fe&&!!i.clearcoatNormalMap,xe=fe&&!!i.clearcoatRoughnessMap,Se=he&&!!i.iridescenceMap,Ce=he&&!!i.iridescenceThicknessMap,we=ge&&!!i.sheenColorMap,Te=ge&&!!i.sheenRoughnessMap,Ee=!!i.specularMap,De=!!i.specularColorMap,Oe=!!i.specularIntensityMap,ke=_e&&!!i.transmissionMap,Ae=_e&&!!i.thicknessMap,je=!!i.gradientMap,Me=!!i.alphaMap,Ne=i.alphaTest>0,F=!!i.alphaHash,Pe=!!i.extensions,Fe=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Fe=e.toneMapping);let Ie={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:ee,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:te,batchingColor:te&&h._colorsTexture!==null,instancing:M,instancingColor:M&&h.instanceColor!==null,instancingMorph:M&&h.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:qt.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:N,matcap:ne,envMap:re,envMapMode:re&&x.mapping,envMapCubeUVHeight:S,aoMap:ie,lightMap:ae,bumpMap:oe,normalMap:se,displacementMap:ce,emissiveMap:le,normalMapObjectSpace:se&&i.normalMapType===1,normalMapTangentSpace:se&&i.normalMapType===0,packedNormalMap:se&&i.normalMapType===0&&uu(i.normalMap.format),metalnessMap:P,roughnessMap:ue,anisotropy:de,anisotropyMap:ve,clearcoat:fe,clearcoatMap:ye,clearcoatNormalMap:be,clearcoatRoughnessMap:xe,dispersion:pe,retroreflection:me,iridescence:he,iridescenceMap:Se,iridescenceThicknessMap:Ce,sheen:ge,sheenColorMap:we,sheenRoughnessMap:Te,specularMap:Ee,specularColorMap:De,specularIntensityMap:Oe,transmission:_e,transmissionMap:ke,thicknessMap:Ae,gradientMap:je,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Me,alphaTest:Ne,alphaHash:F,combine:i.combine,mapUv:N&&m(i.map.channel),aoMapUv:ie&&m(i.aoMap.channel),lightMapUv:ae&&m(i.lightMap.channel),bumpMapUv:oe&&m(i.bumpMap.channel),normalMapUv:se&&m(i.normalMap.channel),displacementMapUv:ce&&m(i.displacementMap.channel),emissiveMapUv:le&&m(i.emissiveMap.channel),metalnessMapUv:P&&m(i.metalnessMap.channel),roughnessMapUv:ue&&m(i.roughnessMap.channel),anisotropyMapUv:ve&&m(i.anisotropyMap.channel),clearcoatMapUv:ye&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:be&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:Ce&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:we&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Te&&m(i.sheenRoughnessMap.channel),specularMapUv:Ee&&m(i.specularMap.channel),specularColorMapUv:De&&m(i.specularColorMap.channel),specularIntensityMapUv:Oe&&m(i.specularIntensityMap.channel),transmissionMapUv:ke&&m(i.transmissionMap.channel),thicknessMapUv:Ae&&m(i.thicknessMap.channel),alphaMapUv:Me&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(se||de),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(N||Me),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&se===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Fe,decodeVideoTexture:N&&i.map.isVideoTexture===!0&&qt.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:le&&i.emissiveMap.isVideoTexture===!0&&qt.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Pe&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Pe&&i.extensions.multiDraw===!0||te)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ie.vertexUv1s=c.has(1),Ie.vertexUv2s=c.has(2),Ie.vertexUv3s=c.has(3),c.clear(),Ie}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Ms[t];n=xo.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new ou(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function fu(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function pu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function mu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function hu(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||pu),r.length>1&&r.sort(t||mu),i.length>1&&i.sort(t||mu)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function gu(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new hu,e.set(t,[i])):n>=r.length?(i=new hu,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function _u(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new V,color:new Gn};break;case`SpotLight`:n={position:new V,direction:new V,color:new Gn,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new V,color:new Gn,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new V,skyColor:new Gn,groundColor:new Gn};break;case`RectAreaLight`:n={color:new Gn,position:new V,halfWidth:new V,halfHeight:new V}}return e[t.id]=n,n}}}function vu(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new B,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var yu=0;function bu(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function xu(e){let t=new _u,n=vu(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new V);let i=new V,a=new un,o=new un;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(bu);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=H.LTC_FLOAT_1,r.rectAreaLTC2=H.LTC_FLOAT_2):(r.rectAreaLTC1=H.LTC_HALF_1,r.rectAreaLTC2=H.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=yu++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Su(e){let t=new xu(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Cu(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Su(e),t.set(n,[a])):r>=i.length?(a=new Su(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var wu=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Tu=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Eu=[new V(1,0,0),new V(-1,0,0),new V(0,1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1)],Du=[new V(0,-1,0),new V(0,-1,0),new V(0,0,1),new V(0,0,-1),new V(0,-1,0),new V(0,-1,0)],Ou=new un,ku=new V,Au=new V;function ju(e,t,n){let r=new Di,i=new B,a=new B,o=new an,s=new Do,c=new Oo,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},p=new wo({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new B},radius:{value:4}},vertexShader:wu,fragmentShader:Tu}),m=p.clone();m.defines.HORIZONTAL_PASS=1;let g=new Vr;g.setAttribute(`position`,new Er(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new di(g,p),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let y=this.type;this.render=function(t,n,s){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||t.length===0)return;this.type===2&&(R(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.state;p.setBlending(0),p.buffers.depth.getReversed()===!0?p.buffers.color.setClear(0,0,0,0):p.buffers.color.setClear(1,1,1,1),p.buffers.depth.setTest(!0),p.setScissorTest(!1);let m=y!==this.type;m&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){R(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let g=d.getFrameExtents();i.multiply(g),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/g.x),i.x=a.x*g.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/g.y),i.y=a.y*g.y,d.mapSize.y=a.y));let _=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=_,d.map===null||m===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){R(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new sn(i.x,i.y,{format:ie,type:T,minFilter:h,magFilter:h,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Li(i.x,i.y,w),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=te,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=f,d.map.depthTexture.magFilter=f}else l.isPointLight?(d.map=new cc(i.x),d.map.depthTexture=new Ri(i.x,C)):(d.map=new sn(i.x,i.y),d.map.depthTexture=new Li(i.x,i.y,C)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=te,this.type===1?(d.map.depthTexture.compareFunction=_?518:515,d.map.depthTexture.minFilter=h,d.map.depthTexture.magFilter=h):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=f,d.map.depthTexture.magFilter=f);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let v=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<v;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),ku.setFromMatrixPosition(l.matrixWorld),e.position.copy(ku),Au.copy(e.position),Au.add(Eu[t]),e.up.copy(Du[t]),e.lookAt(Au),e.updateMatrixWorld(),n.makeTranslation(-ku.x,-ku.y,-ku.z),Ou.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Ou,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),p.viewport(o)}r=d.getFrustum(t),S(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&b(d,s),d.needsUpdate=!1}y=this.type,v.needsUpdate=!1,e.setRenderTarget(c,l,d)};function b(n,r){let a=t.update(_);p.defines.VSM_SAMPLES!==n.blurSamples&&(p.defines.VSM_SAMPLES=n.blurSamples,m.defines.VSM_SAMPLES=n.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),n.mapPass===null?n.mapPass=new sn(i.x,i.y,{format:ie,type:T}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),p.uniforms.shadow_pass.value=n.map.depthTexture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,p,_,null),m.uniforms.shadow_pass.value=n.mapPass.texture,m.uniforms.resolution.value.set(n.map.width,n.map.height),m.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,m,_,null)}function x(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,E)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function S(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=x(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=x(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)S(c[e],i,a,o,s)}function E(e){e.target.removeEventListener(`dispose`,E);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Mu(e,t){function n(){let t=!1,n=new an,r=null,i=new an(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?P(e.DEPTH_TEST):ue(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=ut[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?P(e.STENCIL_TEST):ue(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Gn(0,0,0),T=0,E=!1,D=null,ee=null,O=null,k=null,A=null,j=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),M=!1,te=0,N=e.getParameter(e.VERSION);N.indexOf(`WebGL`)===-1?N.indexOf(`OpenGL ES`)!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),M=te>=2):(te=parseFloat(/^WebGL (\d)/.exec(N)[1]),M=te>=1);let ne=null,re={},ie=e.getParameter(e.SCISSOR_BOX),ae=e.getParameter(e.VIEWPORT),oe=new an().fromArray(ie),se=new an().fromArray(ae);function ce(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let le={};le[e.TEXTURE_2D]=ce(e.TEXTURE_2D,e.TEXTURE_2D,1),le[e.TEXTURE_CUBE_MAP]=ce(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[e.TEXTURE_2D_ARRAY]=ce(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),le[e.TEXTURE_3D]=ce(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),P(e.DEPTH_TEST),o.setFunc(3),ve(!1),ye(1),P(e.CULL_FACE),ge(0);function P(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ue(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function de(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function fe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function pe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let me={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};me[103]=e.MIN,me[104]=e.MAX;let he={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ge(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(ue(e.BLEND),g=!1);return}if(g===!1&&(P(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:z(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:z(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:z(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:z(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a=a||n,o=o||r,s=s||i,(n!==v||a!==x)&&(e.blendEquationSeparate(me[n],me[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(he[r],he[i],he[o],he[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function _e(t,n){t.side===2?ue(e.CULL_FACE):P(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ve(r),t.blending===1&&t.transparent===!1?ge(0):ge(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),xe(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?P(e.SAMPLE_ALPHA_TO_COVERAGE):ue(e.SAMPLE_ALPHA_TO_COVERAGE)}function ve(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ye(t){t===0?ue(e.CULL_FACE):(P(e.CULL_FACE),t!==ee&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),ee=t}function be(t){t!==O&&(M&&e.lineWidth(t),O=t)}function xe(t,n,r){t?(P(e.POLYGON_OFFSET_FILL),(k!==n||A!==r)&&(k=n,A=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):ue(e.POLYGON_OFFSET_FILL)}function Se(t){t?P(e.SCISSOR_TEST):ue(e.SCISSOR_TEST)}function Ce(t){t===void 0&&(t=e.TEXTURE0+j-1),ne!==t&&(e.activeTexture(t),ne=t)}function we(t,n,r){r===void 0&&(r=ne===null?e.TEXTURE0+j-1:ne);let i=re[r];i===void 0&&(i={type:void 0,texture:void 0},re[r]=i),(i.type!==t||i.texture!==n)&&(ne!==r&&(e.activeTexture(r),ne=r),e.bindTexture(t,n||le[t]),i.type=t,i.texture=n)}function Te(){let t=re[ne];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ee(){try{e.compressedTexImage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function De(){try{e.compressedTexImage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Oe(){try{e.texSubImage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function ke(){try{e.texSubImage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Ae(){try{e.compressedTexSubImage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function je(){try{e.compressedTexSubImage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Me(){try{e.texStorage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Ne(){try{e.texStorage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function F(){try{e.texImage2D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Pe(){try{e.texImage3D(...arguments)}catch(e){z(`WebGLState:`,e)}}function Fe(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ie(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function I(t){oe.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),oe.copy(t))}function Le(t){se.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),se.copy(t))}function L(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Re(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function ze(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},ne=null,re={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Gn(0,0,0),T=0,E=!1,D=null,ee=null,O=null,k=null,A=null,oe.set(0,0,e.canvas.width,e.canvas.height),se.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:P,disable:ue,bindFramebuffer:de,drawBuffers:fe,useProgram:pe,setBlending:ge,setMaterial:_e,setFlipSided:ve,setCullFace:ye,setLineWidth:be,setPolygonOffset:xe,setScissorTest:Se,activeTexture:Ce,bindTexture:we,unbindTexture:Te,compressedTexImage2D:Ee,compressedTexImage3D:De,texImage2D:F,texImage3D:Pe,pixelStorei:Ie,getParameter:Fe,updateUBOMapping:L,uniformBlockBinding:Re,texStorage2D:Me,texStorage3D:Ne,texSubImage2D:Oe,texSubImage3D:ke,compressedTexSubImage2D:Ae,compressedTexSubImage3D:je,scissor:I,viewport:Le,reset:ze}}function Nu(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new B,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):rt(`canvas`)}function T(e,t,n){let r=1,i=Fe(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),R(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&R(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function E(e){return e.generateMipmaps}function D(t){e.generateMipmap(t)}function ee(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function O(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];R(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||R(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Ye:qt.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function k(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,R(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function A(e,t){return E(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function j(e){let t=e.target;t.removeEventListener(`dispose`,j),te(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function M(e){let t=e.target;t.removeEventListener(`dispose`,M),re(t)}function te(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=S.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&ne(e),Object.keys(i).length===0&&S.delete(n)}r.remove(e)}function ne(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=S.get(i);delete a[n.__cacheKey],o.memory.textures--}function re(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let ie=0;function ae(){ie=0}function oe(){return ie}function se(e){ie=e}function ce(){let e=ie;return e>=i.maxTextures&&R(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),ie+=1,e}function le(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function P(t,i){let a=r.get(t);if(t.isVideoTexture&&F(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)R(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)R(`WebGLRenderer: Texture marked for update but image is incomplete`);else{be(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ue(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){be(a,t,i);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function de(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){be(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function fe(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){xe(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let pe={[l]:e.REPEAT,[u]:e.CLAMP_TO_EDGE,[d]:e.MIRRORED_REPEAT},me={[f]:e.NEAREST,[p]:e.NEAREST_MIPMAP_NEAREST,[m]:e.NEAREST_MIPMAP_LINEAR,[h]:e.LINEAR,[g]:e.LINEAR_MIPMAP_NEAREST,[_]:e.LINEAR_MIPMAP_LINEAR},he={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function ge(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&R(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,pe[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,pe[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,pe[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,me[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,me[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,he[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function _e(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,j));let i=n.source,a=S.get(i);a===void 0&&(a={},S.set(i,a));let s=le(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&ne(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function ve(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ye(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=ve(n.start,r.width,4),c=ve(t.start,r.width,4);n.start<=i+1&&a===c&&ve(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function be(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=_e(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let d=r.get(u);if(u.version!==d.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=qt.getPrimaries(qt.workingColorSpace),r=o.colorSpace===``?null:qt.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=T(o.image,!1,i.maxTextureSize);t=Pe(o,t);let r=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=O(o.internalFormat,r,f,o.normalized,o.colorSpace,o.isVideoTexture);ge(c,o);let m,h=o.mipmaps,g=o.isVideoTexture!==!0,_=d.__version===void 0||l===!0,v=u.dataReady,y=A(o,t);if(o.isDepthTexture)p=k(o.format===N,o.type),_&&(g?n.texStorage2D(e.TEXTURE_2D,1,p,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,p,t.width,t.height,0,r,f,null));else if(o.isDataTexture){if(h.length>0){g&&_&&n.texStorage2D(e.TEXTURE_2D,y,p,h[0].width,h[0].height);for(let t=0,i=h.length;t<i;t++)m=h[t],g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,m.width,m.height,r,f,m.data):n.texImage2D(e.TEXTURE_2D,t,p,m.width,m.height,0,r,f,m.data);o.generateMipmaps=!1}else g?(_&&n.texStorage2D(e.TEXTURE_2D,y,p,t.width,t.height),v&&ye(o,t,r,f)):n.texImage2D(e.TEXTURE_2D,0,p,t.width,t.height,0,r,f,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){g&&_&&n.texStorage3D(e.TEXTURE_2D_ARRAY,y,p,h[0].width,h[0].height,t.depth);for(let i=0,a=h.length;i<a;i++)if(m=h[i],o.format!==1023){if(r!==null){if(g){if(v){if(o.layerUpdates.size>0){let t=Ds(m.width,m.height,o.format,o.type);for(let a of o.layerUpdates){let o=m.data.subarray(a*t/m.data.BYTES_PER_ELEMENT,(a+1)*t/m.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,m.width,m.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,m.width,m.height,t.depth,r,m.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,p,m.width,m.height,t.depth,0,m.data,0,0)}else R(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,m.width,m.height,t.depth,r,f,m.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,p,m.width,m.height,t.depth,0,r,f,m.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{g&&_&&n.texStorage2D(e.TEXTURE_2D,y,p,h[0].width,h[0].height);for(let t=0,i=h.length;t<i;t++)m=h[t],o.format===1023?g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,m.width,m.height,r,f,m.data):n.texImage2D(e.TEXTURE_2D,t,p,m.width,m.height,0,r,f,m.data):r===null?R(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,m.width,m.height,r,m.data):n.compressedTexImage2D(e.TEXTURE_2D,t,p,m.width,m.height,0,m.data)}}else if(o.isDataArrayTexture){if(g){if(_&&n.texStorage3D(e.TEXTURE_2D_ARRAY,y,p,t.width,t.height,t.depth),v){if(o.layerUpdates.size>0){let i=Ds(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,f,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,f,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,p,t.width,t.height,t.depth,0,r,f,t.data)}else if(o.isData3DTexture)g?(_&&n.texStorage3D(e.TEXTURE_3D,y,p,t.width,t.height,t.depth),v&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,f,t.data)):n.texImage3D(e.TEXTURE_3D,0,p,t.width,t.height,t.depth,0,r,f,t.data);else if(o.isFramebufferTexture){if(_){if(g)n.texStorage2D(e.TEXTURE_2D,y,p,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<y;t++)n.texImage2D(e.TEXTURE_2D,t,p,i,a,0,r,f,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),b.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let t=Fe(h[0]);n.texStorage2D(e.TEXTURE_2D,y,p,t.width,t.height)}for(let t=0,i=h.length;t<i;t++)m=h[t],g?v&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,f,m):n.texImage2D(e.TEXTURE_2D,t,p,r,f,m);o.generateMipmaps=!1}else if(g){if(_){let r=Fe(t);n.texStorage2D(e.TEXTURE_2D,y,p,r.width,r.height)}v&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,f,t)}else n.texImage2D(e.TEXTURE_2D,0,p,r,f,t);E(o)&&D(c),d.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function xe(t,o,s){if(o.image.length!==6)return;let c=_e(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=qt.getPrimaries(qt.workingColorSpace),r=o.colorSpace===``?null:qt.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=T(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Pe(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),v=O(o.internalFormat,g,_,o.normalized,o.colorSpace),y=o.isVideoTexture!==!0,b=u.__version===void 0||c===!0,x=l.dataReady,S=A(o,h);ge(e.TEXTURE_CUBE_MAP,o);let C;if(f){y&&b&&n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let t=0;t<6;t++){C=m[t].mipmaps;for(let r=0;r<C.length;r++){let i=C[r];o.format===1023?y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,g,_,i.data):g===null?R(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,i.data)}}}else{if(C=o.mipmaps,y&&b){C.length>0&&S++;let t=Fe(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,S,v,t.width,t.height)}for(let t=0;t<6;t++)if(p){y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<C.length;r++){let i=C[r].image[t].image;y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,i.width,i.height,0,g,_,i.data)}}else{y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,m[t]);for(let r=0;r<C.length;r++){let i=C[r];y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,g,_,i.image[t])}}}E(o)&&D(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function Se(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=O(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Ne(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Me(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ce(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=k(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Ne(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Me(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Me(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=O(o.internalFormat,c,l,o.normalized,o.colorSpace);Ne(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Me(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Me(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function we(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,j)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),ge(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else P(i.depthTexture,0);let u=l.__webglTexture,d=Me(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Ne(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Ne(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Te(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)we(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?we(i.__webglFramebuffer[0],t,0):we(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),Ce(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),Ce(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ee(t,n,i){let a=r.get(t);n!==void 0&&Se(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&Te(t)}function De(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,M);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Ne(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=O(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Me(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),Ce(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),ge(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)Se(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else Se(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);E(i)&&D(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),ge(c,a),Se(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),E(a)&&D(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),ge(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)Se(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else Se(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);E(i)&&D(r),n.unbindTexture()}t.depthBuffer&&Te(t)}function Oe(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(E(a)){let t=ee(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),D(t),n.unbindTexture()}}}let ke=[],Ae=[];function je(t){if(t.samples>0){if(Ne(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(ke.length=0,Ae.length=0,ke.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(ke.push(l),Ae.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Ae)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,ke))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Me(e){return Math.min(i.maxSamples,e.samples)}function Ne(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function F(e){let t=o.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Pe(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(qt.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&R(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):z(`WebGLTextures: Unsupported texture color space:`,n)),t}function Fe(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=ce,this.resetTextureUnits=ae,this.getTextureUnits=oe,this.setTextureUnits=se,this.setTexture2D=P,this.setTexture2DArray=ue,this.setTexture3D=de,this.setTextureCube=fe,this.rebindTextures=Ee,this.setupRenderTarget=De,this.updateRenderTargetMipmap=Oe,this.updateMultisampleRenderTarget=je,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=Ne,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Pu(e,t){function n(n,r=``){let i,a=qt.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Fu=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Iu=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Lu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new zi(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new wo({vertexShader:Fu,fragmentShader:Iu,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new di(new fo(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ru=class extends dt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Lu,g={},_=t.getContextAttributes(),y=null,b=null,x=[],S=[],w=new B,T=null,E=null,D=new ss;D.viewport=new an;let O=new ss;O.viewport=new an;let k=[D,O],A=new ms,j=null,ne=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=x[e];return t===void 0&&(t=new Bn,x[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=x[e];return t===void 0&&(t=new Bn,x[e]=t),t.getGripSpace()},this.getHand=function(e){let t=x[e];return t===void 0&&(t=new Bn,x[e]=t),t.getHandSpace()};function re(e){let t=S.indexOf(e.inputSource);if(t===-1)return;let n=x[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ie(){r.removeEventListener(`select`,re),r.removeEventListener(`selectstart`,re),r.removeEventListener(`selectend`,re),r.removeEventListener(`squeeze`,re),r.removeEventListener(`squeezestart`,re),r.removeEventListener(`squeezeend`,re),r.removeEventListener(`end`,ie),r.removeEventListener(`inputsourceschange`,ae);for(let e=0;e<x.length;e++){let t=S[e];t!==null&&(S[e]=null,x[e].disconnect(t))}j=null,ne=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(y),f=null,d=null,u=null,r=null,b=null,fe.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(w.width,w.height,!1),E!==null){let e=E.camera;e.fov=E.fov,e.zoom=E.zoom,e.updateProjectionMatrix(),E=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&R(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&R(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(y=e.getRenderTarget(),r.addEventListener(`select`,re),r.addEventListener(`selectstart`,re),r.addEventListener(`selectend`,re),r.addEventListener(`squeeze`,re),r.addEventListener(`squeezestart`,re),r.addEventListener(`squeezeend`,re),r.addEventListener(`end`,ie),r.addEventListener(`inputsourceschange`,ae),_.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(w),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?N:te,a=_.stencil?ee:C);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),b=new sn(d.textureWidth,d.textureHeight,{format:M,type:v,depthTexture:new Li(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new sn(f.framebufferWidth,f.framebufferHeight,{format:M,type:v,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),fe.setContext(r),fe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function ae(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=S.indexOf(n);r>=0&&(S[r]=null,x[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=S.indexOf(n);if(r===-1){for(let e=0;e<x.length;e++)if(e>=S.length){S.push(n),r=e;break}else if(S[e]===null){S[e]=n,r=e;break}if(r===-1)break}let i=x[r];i&&i.connect(n)}}let oe=new V,se=new V;function ce(e,t,n){oe.setFromMatrixPosition(t.matrixWorld),se.setFromMatrixPosition(n.matrixWorld);let r=oe.distanceTo(se),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function le(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),A.near=O.near=D.near=t,A.far=O.far=D.far=n,(j!==A.near||ne!==A.far)&&(r.updateRenderState({depthNear:A.near,depthFar:A.far}),j=A.near,ne=A.far),A.layers.mask=e.layers.mask|6,D.layers.mask=A.layers.mask&-5,O.layers.mask=A.layers.mask&-3;let i=e.parent,a=A.cameras;le(A,i);for(let e=0;e<a.length;e++)le(a[e],i);a.length===2?ce(A,D,O):A.projectionMatrix.copy(D.projectionMatrix),E===null&&e.isPerspectiveCamera&&(E={camera:e,fov:e.fov,zoom:e.zoom}),P(e,A,i)};function P(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=ht*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(A)},this.getCameraTexture=function(e){return g[e]};let ue=null;function de(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(b,f.framebuffer),e.setRenderTarget(b));let i=!1;t.length!==A.cameras.length&&(A.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(b,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(b))}let o=k[n];o===void 0&&(o=new ss,o.layers.enable(n),o.viewport=new an,k[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(A.matrix.copy(o.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),i===!0&&A.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new zi,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<x.length;e++){let t=S[e],n=x[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ue&&ue(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let fe=new ks;fe.setAnimationLoop(de),this.setAnimationLoop=function(e){ue=e},this.dispose=function(){}}},zu=new un,Bu=new Ht;Bu.set(-1,0,0,0,1,0,0,0,1);function Vu(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,bo(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(zu.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Bu),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Hu(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return z(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?R(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):R(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Uu=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Wu=null;function Gu(){return Wu===null&&(Wu=new mi(Uu,16,16,ie,T),Wu.name=`DFG_LUT`,Wu.minFilter=h,Wu.magFilter=h,Wu.wrapS=u,Wu.wrapT=u,Wu.generateMipmaps=!1,Wu.needsUpdate=!0),Wu}var Ku=class{constructor(e={}){let{canvas:t=it(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=v}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([oe,ae,re]),g=new Set([v,C,x,ee,E,D]),y=new Uint32Array(4),b=new Int32Array(4),S=new V,w=null,O=null,k=[],A=[],j=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let M=this,te=!1,N=null,ne=null,ie=null,se=null;this._outputColorSpace=qe;let ce=0,le=0,P=null,ue=-1,de=null,fe=new an,pe=new an,me=null,he=new Gn(0),ge=0,_e=t.width,ve=t.height,ye=1,be=null,xe=null,Se=new an(0,0,_e,ve),Ce=new an(0,0,_e,ve),we=!1,Te=new Di,Ee=!1,De=!1,Oe=new un,ke=new V,Ae=new an,je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Me=!1;function Ne(){return P===null?ye:1}let F=n;function Pe(e,n){return t.getContext(e,n)}let Fe,Ie,I,Le,L,Re,ze,Be,Ve,He,Ue,We,Ge,Ke,Je,Ye,Xe,Ze,Qe,$e,tt,nt,rt;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,ct,!1),t.addEventListener(`webglcontextrestored`,ut,!1),t.addEventListener(`webglcontextcreationerror`,dt,!1),F===null){let t=`webgl2`;if(F=Pe(t,e),F===null)throw Pe(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}at()}catch(e){throw t.removeEventListener(`webglcontextlost`,ct,!1),t.removeEventListener(`webglcontextrestored`,ut,!1),t.removeEventListener(`webglcontextcreationerror`,dt,!1),z(`WebGLRenderer: `+e.message),e}function at(){Fe=new uc(F),Fe.init(),tt=new Pu(F,Fe),Ie=new zs(F,Fe,e,tt),I=new Mu(F,Fe),Ie.reversedDepthBuffer&&d&&I.buffers.depth.setReversed(!0),ne=F.createFramebuffer(),ie=F.createFramebuffer(),se=F.createFramebuffer(),Le=new pc(F),L=new fu,Re=new Nu(F,Fe,I,L,Ie,tt,Le),ze=new lc(M),Be=new As(F),nt=new Ls(F,Be),Ve=new dc(F,Be,Le,nt),He=new hc(F,Ve,Be,nt,Le),Ze=new mc(F,Ie,Re),Je=new Bs(L),Ue=new du(M,ze,Fe,Ie,nt,Je),We=new Vu(M,L),Ge=new gu,Ke=new Cu(Fe),Xe=new Is(M,ze,I,He,p,s),Ye=new ju(M,He,Ie),rt=new Hu(F,Le,Ie,I),Qe=new Rs(F,Fe,Le),$e=new fc(F,Fe,Le),Le.programs=Ue.programs,M.capabilities=Ie,M.extensions=Fe,M.properties=L,M.renderLists=Ge,M.shadowMap=Ye,M.state=I,M.info=Le}m!==1009&&(j=new _c(m,t.width,t.height,o,r,i));let st=new Ru(M,F);this.xr=st,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let e=Fe.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Fe.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ye},this.setPixelRatio=function(e){e!==void 0&&(ye=e,this.setSize(_e,ve,!1))},this.getSize=function(e){return e.set(_e,ve)},this.setSize=function(e,n,r=!0){if(st.isPresenting){R(`WebGLRenderer: Can't change size while VR device is presenting.`);return}_e=e,ve=n,t.width=Math.floor(e*ye),t.height=Math.floor(n*ye),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),j!==null&&j.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(_e*ye,ve*ye).floor()},this.setDrawingBufferSize=function(e,n,r){_e=e,ve=n,ye=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009){z(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){R(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}j.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(fe)},this.getViewport=function(e){return e.copy(Se)},this.setViewport=function(e,t,n,r){e.isVector4?Se.set(e.x,e.y,e.z,e.w):Se.set(e,t,n,r),I.viewport(fe.copy(Se).multiplyScalar(ye).round())},this.getScissor=function(e){return e.copy(Ce)},this.setScissor=function(e,t,n,r){e.isVector4?Ce.set(e.x,e.y,e.z,e.w):Ce.set(e,t,n,r),I.scissor(pe.copy(Ce).multiplyScalar(ye).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(e){I.setScissorTest(we=e)},this.setOpaqueSort=function(e){be=e},this.setTransparentSort=function(e){xe=e},this.getClearColor=function(e){return e.copy(Xe.getClearColor())},this.setClearColor=function(){Xe.setClearColor(...arguments)},this.getClearAlpha=function(){return Xe.getClearAlpha()},this.setClearAlpha=function(){Xe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(P!==null){let t=P.texture.format;e=h.has(t)}if(e){let e=P.texture.type,t=g.has(e),n=Xe.getClearColor(),r=Xe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(y[0]=i,y[1]=a,y[2]=o,y[3]=r,F.clearBufferuiv(F.COLOR,0,y)):(b[0]=i,b[1]=a,b[2]=o,b[3]=r,F.clearBufferiv(F.COLOR,0,b))}else r|=F.COLOR_BUFFER_BIT}t&&(r|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&F.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),N=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,ct,!1),t.removeEventListener(`webglcontextrestored`,ut,!1),t.removeEventListener(`webglcontextcreationerror`,dt,!1),Xe.dispose(),Ge.dispose(),Ke.dispose(),L.dispose(),ze.dispose(),He.dispose(),nt.dispose(),rt.dispose(),Ue.dispose(),st.dispose(),st.removeEventListener(`sessionstart`,vt),st.removeEventListener(`sessionend`,yt),bt.stop()};function ct(e){e.preventDefault(),ot(`WebGLRenderer: Context Lost.`),te=!0}function ut(){ot(`WebGLRenderer: Context Restored.`),te=!1;let e=Le.autoReset,t=Ye.enabled,n=Ye.autoUpdate,r=Ye.needsUpdate,i=Ye.type;at(),Le.autoReset=e,Ye.enabled=t,Ye.autoUpdate=n,Ye.needsUpdate=r,Ye.type=i}function dt(e){z(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function ft(e){let t=e.target;t.removeEventListener(`dispose`,ft),pt(t)}function pt(e){mt(e),L.remove(e)}function mt(e){let t=L.get(e).programs;t!==void 0&&(t.forEach(function(e){Ue.releaseProgram(e)}),e.isShaderMaterial&&Ue.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=je);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=At(e,t,n,r,i);I.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ve.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;nt.setup(i,r,s,n,c);let h,g=Qe;if(c!==null&&(h=Be.get(c),g=$e,g.setIndex(h)),i.isMesh)r.wireframe===!0?(I.setLineWidth(r.wireframeLinewidth*Ne()),g.setMode(F.LINES)):g.setMode(F.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),I.setLineWidth(e*Ne()),i.isLineSegments?g.setMode(F.LINES):i.isLineLoop?g.setMode(F.LINE_LOOP):g.setMode(F.LINE_STRIP)}else i.isPoints?g.setMode(F.POINTS):i.isSprite&&g.setMode(F.TRIANGLES);if(i.isBatchedMesh){if(Fe.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Be.get(c).bytesPerElement:1,o=L.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(F,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function ht(e,t,n,r){N!==null&&e.isNodeMaterial&&N.setObject(r,e),Ee===!0&&Je.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,Et(e,t,r),e.side=0,e.needsUpdate=!0,Et(e,t,r),e.side=2):Et(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),N!==null&&N.renderStart(e,t,n),O=Ke.get(n),O.init(t),A.push(O),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(O.pushLight(e),e.castShadow&&O.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(O.pushLight(e),e.castShadow&&O.pushShadow(e))}),O.setupLights(),N!==null&&N.updateLights(O.state.lightsArray),De=this.localClippingEnabled,Ee=Je.init(this.clippingPlanes,De),Ee===!0&&Je.setGlobalState(this.clippingPlanes,t),N!==null&&Ye.render(O.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];ht(o,n,t,e),r.add(o)}else ht(i,n,t,e),r.add(i)}}),O=A.pop(),N!==null&&N.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){let t=L.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Fe.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let gt=null;function _t(e){gt&&gt(e)}function vt(){bt.stop()}function yt(){bt.start()}let bt=new ks;bt.setAnimationLoop(_t),typeof self<`u`&&bt.setContext(self),this.setAnimationLoop=function(e){gt=e,st.setAnimationLoop(e),e===null?bt.stop():bt.start()},st.addEventListener(`sessionstart`,vt),st.addEventListener(`sessionend`,yt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){z(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(te===!0)return;N!==null&&N.renderStart(e,t);let n=st.enabled===!0&&st.isPresenting===!0,r=j!==null&&(P===null||n)&&j.begin(M,P);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),st.enabled===!0&&st.isPresenting===!0&&(j===null||j.isCompositing()===!1)&&(st.cameraAutoUpdate===!0&&st.updateCamera(t),t=st.getCamera()),e.isScene===!0&&e.onBeforeRender(M,e,t,P),O=Ke.get(e,A.length),O.init(t),O.state.textureUnits=Re.getTextureUnits(),A.push(O),Oe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Te.setFromProjectionMatrix(Oe,et,t.reversedDepth),De=this.localClippingEnabled,Ee=Je.init(this.clippingPlanes,De),w=Ge.get(e,k.length),w.init(),k.push(w),st.enabled===!0&&st.isPresenting===!0){let e=M.xr.getDepthSensingMesh();e!==null&&xt(e,t,-1/0,M.sortObjects)}xt(e,t,0,M.sortObjects),w.finish(),N!==null&&N.updateLights(O.state.lightsArray),M.sortObjects===!0&&w.sort(be,xe),Me=st.enabled===!1||st.isPresenting===!1||st.hasDepthSensing()===!1,Me&&Xe.addToRenderList(w,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ee===!0&&Je.beginShadows();let i=O.state.shadowsArray;if(Ye.render(i,e,t),Ee===!0&&Je.endShadows(),(r&&j.hasRenderPass())===!1){let n=w.opaque,r=w.transmissive;if(O.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];Ct(n,r,e,a)}Me&&Xe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];St(w,e,n,n.viewport)}}else r.length>0&&Ct(n,r,e,t),Me&&Xe.render(e),St(w,e,t)}P!==null&&le===0&&(Re.updateMultisampleRenderTarget(P),Re.updateRenderTargetMipmap(P)),r&&j.end(M),e.isScene===!0&&e.onAfterRender(M,e,t),nt.resetDefaultState(),ue=-1,de=null,A.pop(),A.length>0?(O=A[A.length-1],Re.setTextureUnits(O.state.textureUnits),Ee===!0&&Je.setGlobalState(M.clippingPlanes,O.state.camera)):O=null,k.pop(),w=k.length>0?k[k.length-1]:null,N!==null&&N.renderEnd()};function xt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)O.pushLightProbeGrid(e);else if(e.isLight)O.pushLight(e),e.castShadow&&O.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(Te)){r&&Ae.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Oe);let i=He.update(e),a=e.material;a.visible&&w.push(e,i,a,n,Ae.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(Te))){let i=He.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),Ae.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Ae.copy(e.boundingSphere.center)),Ae.applyMatrix4(e.matrixWorld).applyMatrix4(Oe)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&w.push(e,i,c,n,Ae.z,s,t)}}else a.visible&&w.push(e,i,a,n,Ae.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)xt(i[e],t,n,r)}function St(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;O.setupLightsView(n),Ee===!0&&Je.setGlobalState(M.clippingPlanes,n),r&&I.viewport(fe.copy(r)),i.length>0&&wt(i,t,n),a.length>0&&wt(a,t,n),o.length>0&&wt(o,t,n),I.buffers.depth.setTest(!0),I.buffers.depth.setMask(!0),I.buffers.color.setMask(!0),I.setPolygonOffset(!1)}function Ct(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(O.state.transmissionRenderTarget[r.id]===void 0){let e=Fe.has(`EXT_color_buffer_half_float`)||Fe.has(`EXT_color_buffer_float`);O.state.transmissionRenderTarget[r.id]=new sn(1,1,{generateMipmaps:!0,type:e?T:v,minFilter:_,samples:Math.max(4,Ie.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:qt.workingColorSpace})}let a=O.state.transmissionRenderTarget[r.id],o=r.viewport||fe;a.setSize(o.z*M.transmissionResolutionScale,o.w*M.transmissionResolutionScale);let s=M.getRenderTarget(),c=M.getActiveCubeFace(),l=M.getActiveMipmapLevel();M.setRenderTarget(a),M.getClearColor(he),ge=M.getClearAlpha(),ge<1&&M.setClearColor(16777215,.5),M.clear(),Me&&Xe.render(n);let u=M.toneMapping;M.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),O.setupLightsView(r),Ee===!0&&Je.setGlobalState(M.clippingPlanes,r),wt(e,n,r),Re.updateMultisampleRenderTarget(a),Re.updateRenderTargetMipmap(a),Fe.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,Tt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(Re.updateMultisampleRenderTarget(a),Re.updateRenderTargetMipmap(a))}M.setRenderTarget(s,c,l),M.setClearColor(he,ge),d!==void 0&&(r.viewport=d),M.toneMapping=u}function wt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&Tt(o,t,n,s,l,c)}}function Tt(e,t,n,r,i,a){N!==null&&i.isNodeMaterial&&N.setObject(e,i),e.onBeforeRender(M,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(M,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,M.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,M.renderBufferDirect(n,t,r,i,e,a),i.side=2):M.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(M,t,n,r,i,a)}function Et(e,t,n){t.isScene!==!0&&(t=je);let r=L.get(e),i=O.state.lights,a=O.state.shadowsArray,o=i.state.version,s=Ue.getParameters(e,i.state,a,t,n,O.state.lightProbeGridArray),c=Ue.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=ze.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,ft),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Ot(e,s),d}else s.uniforms=Ue.getUniforms(e),N!==null&&e.isNodeMaterial&&N.build(e,n,s),e.onBeforeCompile(s,M),d=Ue.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Je.uniform),Ot(e,s),r.needsLights=Mt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=O.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Dt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=wl.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Ot(e,t){let n=L.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function kt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];S.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(S))return n}return null}function At(e,t,n,r,i){t.isScene!==!0&&(t=je),Re.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=P===null?M.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:qt.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=ze.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(h=M.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=L.get(r),y=O.state.lights;if(Ee===!0&&(De===!0||e!==de)){let t=e===de&&r.id===ue;Je.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Je.numPlanes||v.numIntersection!==Je.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=O.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=Et(r,t,i),N&&r.isNodeMaterial&&N.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(I.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==ue&&(ue=r.id,C=!0),v.needsLights){let e=kt(O.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||de!==e){I.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(F,`projectionMatrix`,e.projectionMatrix),T.setValue(F,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(F,ke.setFromMatrixPosition(e.matrixWorld)),Ie.logarithmicDepthBuffer&&T.setValue(F,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(F,`isOrthographic`,e.isOrthographicCamera===!0),de!==e&&(de=e,C=!0,w=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&T.setValue(F,`sunShadowMap`,y.state.sunShadowMap,Re),y.state.directionalShadowMap.length>0&&T.setValue(F,`directionalShadowMap`,y.state.directionalShadowMap,Re),y.state.spotShadowMap.length>0&&T.setValue(F,`spotShadowMap`,y.state.spotShadowMap,Re),y.state.pointShadowMap.length>0&&T.setValue(F,`pointShadowMap`,y.state.pointShadowMap,Re)),i.isSkinnedMesh){T.setOptional(F,i,`bindMatrix`),T.setOptional(F,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(F,`boneTexture`,e.boneTexture,Re))}i.isBatchedMesh&&(T.setOptional(F,i,`batchingTexture`),T.setValue(F,`batchingTexture`,i._matricesTexture,Re),T.setOptional(F,i,`batchingIdTexture`),T.setValue(F,`batchingIdTexture`,i._indirectTexture,Re),T.setOptional(F,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(F,`batchingColorTexture`,i._colorsTexture,Re));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&Ze.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(F,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=Gu()),C){if(T.setValue(F,`toneMappingExposure`,M.toneMappingExposure),v.needsLights&&jt(E,w),a&&r.fog===!0&&We.refreshFogUniforms(E,a),We.refreshMaterialUniforms(E,r,ye,ve,O.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}wl.upload(F,Dt(v),E,Re)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(wl.upload(F,Dt(v),E,Re),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(F,`center`,i.center),T.setValue(F,`modelViewMatrix`,i.modelViewMatrix),T.setValue(F,`normalMatrix`,i.normalMatrix),T.setValue(F,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];rt.update(n,x),rt.bind(n,x)}}return x}function jt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Mt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ce},this.getActiveMipmapLevel=function(){return le},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(e,t,n){let r=L.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),L.get(e.texture).__webglTexture=t,L.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=L.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){P=e,ce=t,le=n;let r=null,i=!1,a=!1;if(e){let o=L.get(e);if(o.__useDefaultFramebuffer!==void 0){I.bindFramebuffer(F.FRAMEBUFFER,o.__webglFramebuffer),fe.copy(e.viewport),pe.copy(e.scissor),me=e.scissorTest,I.viewport(fe),I.scissor(pe),I.setScissorTest(me),ue=-1;return}if(o.__webglFramebuffer===void 0)Re.setupRenderTarget(e);else if(o.__hasExternalTextures)Re.rebindTextures(e,L.get(e.texture).__webglTexture,L.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&L.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);Re.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=L.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&Re.useMultisampledRTT(e)===!1?L.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,fe.copy(e.viewport),pe.copy(e.scissor),me=e.scissorTest}else fe.copy(Se).multiplyScalar(ye).floor(),pe.copy(Ce).multiplyScalar(ye).floor(),me=we;if(n!==0&&(r=ne),I.bindFramebuffer(F.FRAMEBUFFER,r)&&I.drawBuffers(e,r),I.viewport(fe),I.scissor(pe),I.setScissorTest(me),i){let r=L.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=L.get(e.textures[t]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=L.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,t.__webglTexture,n)}ue=-1};function Nt(e){let t=L.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ie.textureFormatReadable(e.format),t.__typeReadable=Ie.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){z(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=L.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){I.bindFramebuffer(F.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let u=Nt(o);if(u.__formatReadable===!1){z(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){z(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&F.readPixels(t,n,r,i,tt.convert(c),tt.convert(l),a)}finally{let e=P===null?null:L.get(P).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=L.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){I.bindFramebuffer(F.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let d=Nt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.bufferData(F.PIXEL_PACK_BUFFER,a.byteLength,F.STREAM_READ),F.readPixels(t,n,r,i,tt.convert(l),tt.convert(u),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let p=P===null?null:L.get(P).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,p);let m=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await lt(F,m,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,a),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(f),F.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Re.setTexture2D(e,0),F.copyTexSubImage2D(F.TEXTURE_2D,n,0,0,o,s,i,a),I.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=tt.convert(t.format),_=tt.convert(t.type),v;t.isData3DTexture?(Re.setTexture3D(t,0),v=F.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Re.setTexture2DArray(t,0),v=F.TEXTURE_2D_ARRAY):(Re.setTexture2D(t,0),v=F.TEXTURE_2D),I.activeTexture(F.TEXTURE0),I.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,t.flipY),I.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),I.pixelStorei(F.UNPACK_ALIGNMENT,t.unpackAlignment);let y=I.getParameter(F.UNPACK_ROW_LENGTH),b=I.getParameter(F.UNPACK_IMAGE_HEIGHT),x=I.getParameter(F.UNPACK_SKIP_PIXELS),S=I.getParameter(F.UNPACK_SKIP_ROWS),C=I.getParameter(F.UNPACK_SKIP_IMAGES);I.pixelStorei(F.UNPACK_ROW_LENGTH,h.width),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,h.height),I.pixelStorei(F.UNPACK_SKIP_PIXELS,l),I.pixelStorei(F.UNPACK_SKIP_ROWS,u),I.pixelStorei(F.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=L.get(e),r=L.get(t),h=L.get(n.__renderTarget),g=L.get(r.__renderTarget);I.bindFramebuffer(F.READ_FRAMEBUFFER,h.__webglFramebuffer),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(e).__webglTexture,i,d+n),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(t).__webglTexture,a,m+n)),F.blitFramebuffer(l,u,o,s,f,p,o,s,F.DEPTH_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||L.has(e)){let n=L.get(e),r=L.get(t);I.bindFramebuffer(F.READ_FRAMEBUFFER,ie),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,se);for(let e=0;e<c;e++)w?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,n.__webglTexture,i),T?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,r.__webglTexture,a),i===0?T?F.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):F.copyTexSubImage2D(v,a,f,p,l,u,o,s):F.blitFramebuffer(l,u,o,s,f,p,o,s,F.COLOR_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?F.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h);I.pixelStorei(F.UNPACK_ROW_LENGTH,y),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,b),I.pixelStorei(F.UNPACK_SKIP_PIXELS,x),I.pixelStorei(F.UNPACK_SKIP_ROWS,S),I.pixelStorei(F.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&F.generateMipmap(v),I.unbindTexture()},this.initRenderTarget=function(e){L.get(e).__webglFramebuffer===void 0&&Re.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Re.setTextureCube(e,0):e.isData3DTexture?Re.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Re.setTexture2DArray(e,0):Re.setTexture2D(e,0),I.unbindTexture()},this.resetState=function(){ce=0,le=0,P=null,I.reset(),nt.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return et}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=qt._getDrawingBufferColorSpace(e),t.unpackColorSpace=qt._getUnpackColorSpace()}};function qu(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new Vr,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=Ju(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=Ju(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function Ju(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new Er(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var U={renderer:null,scene:null,camera:null,sun:null,hemi:null,camTarget:new V,camPos:new V,shake:0,viewW:9.6,pitch:.93,zoom:1,width:390,height:844},Yu=new Eo({vertexColors:!0}),Xu=new $r({vertexColors:!0});function Zu(e){let t=new Ku({canvas:e,antialias:!0,powerPreference:`high-performance`});t.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1)),t.outputColorSpace=qe,t.shadowMap.enabled=!0,t.shadowMap.type=1,U.renderer=t;let n=new qn;U.scene=n,U.camera=new ss(30,390/844,1,120);let r=new Yo(16777215,8939076,1.1);n.add(r),U.hemi=r;let i=new us(16772829,1.5);i.castShadow=!0,i.shadow.mapSize.set(1024,1024);let a=i.shadow.camera;a.left=-13,a.right=13,a.top=13,a.bottom=-13,a.near=1,a.far=50,i.shadow.bias=-.0012,i.shadow.normalBias=.03,i.shadow.radius=3,n.add(i),n.add(i.target),U.sun=i,$u()}function Qu(e){U.renderer.shadowMap.enabled=e,U.sun.castShadow=e,U.scene.traverse(e=>{e.material&&(e.material.needsUpdate=!0)})}function $u(){let e=document.getElementById(`app`),t=e.clientWidth,n=e.clientHeight;U.width=t,U.height=n,U.renderer.setSize(t,n,!1),U.camera.aspect=t/n,U.camera.updateProjectionMatrix()}var ed=new V;function td(e,t,n,r=!1,i=6){let a=U.camera,o=Rt.degToRad(a.fov),s=Math.tan(o/2)*a.aspect,c=U.viewW*U.zoom/2/s;c=Math.min(Math.max(c,16),48);let l=r?1:1-Math.exp(-e*i);U.camTarget.x+=(t-U.camTarget.x)*l,U.camTarget.z+=(n-U.camTarget.z)*l,U.camTarget.y=.6;let u=U.pitch;if(a.position.set(U.camTarget.x,U.camTarget.y+Math.sin(u)*c,U.camTarget.z+Math.cos(u)*c),U.shake>0){let t=U.shake*.25;a.position.x+=(Math.random()-.5)*t,a.position.y+=(Math.random()-.5)*t,U.shake=Math.max(0,U.shake-e*3)}a.lookAt(U.camTarget.x,U.camTarget.y,U.camTarget.z);let d=U.sun;d.position.set(U.camTarget.x-7,16,U.camTarget.z+5),d.target.position.set(U.camTarget.x,0,U.camTarget.z-1.5)}function nd(e,t,n,r){return ed.set(e,t,n).project(U.camera),r.x=(ed.x*.5+.5)*U.width,r.y=(-ed.y*.5+.5)*U.height,r.vis=ed.z<1&&r.x>-60&&r.x<U.width+60&&r.y>-80&&r.y<U.height+60,r}var rd=new Map;function id(e){let t=rd.get(e);return t||(t=new Gn(e),rd.set(e,t)),t}var ad=new un,od=new zt,sd=new bn,cd=new V,ld=new V;function ud(e,t){let n=e.index?e.toNonIndexed():e.clone();for(let e of Object.keys(n.attributes))e!==`position`&&e!==`normal`&&n.deleteAttribute(e);let r=n.attributes.position.count,i=new Float32Array(r*3),a=new Gn(t);for(let e=0;e<r;e++)i[e*3]=a.r,i[e*3+1]=a.g,i[e*3+2]=a.b;return n.setAttribute(`color`,new Er(i,3)),n}var W=class{constructor(){this.parts=[]}add(e,t,n=0,r=0,i=0,a=0,o=0,s=0,c=1,l=1,u=1){let d=ud(e,t);return sd.set(a,o,s),od.setFromEuler(sd),ad.compose(cd.set(n,r,i),od,ld.set(c,l,u)),d.applyMatrix4(ad),this.parts.push(d),this}addGeo(e){return this.parts.push(e),this}geometry(){if(!this.parts.length)return null;let e=qu(this.parts,!1);return this.parts.forEach(e=>e.dispose()),this.parts=[],e}mesh(e=Yu,t=!0){let n=new di(this.geometry()||new Vr,e);return n.castShadow=t,n.receiveShadow=!0,n}},G={box:(e,t,n)=>new Bi(e,t,n),cyl:(e,t,n,r=14)=>new Ui(e,t,n,r),sph:(e,t=14,n=10)=>new mo(e,t,n),cone:(e,t,n=12)=>new Wi(e,t,n),cap:(e,t,n=8)=>new Vi(e,t,4,n),torus:(e,t,n=8,r=16,i=Math.PI*2)=>new ho(e,t,n,r,i),rbox:(e,t,n,r=.06)=>{let i=new Sa,a=-e/2,o=-n/2;r=Math.min(r,e/2-.001,n/2-.001),i.moveTo(a+r,o),i.lineTo(a+e-r,o),i.quadraticCurveTo(a+e,o,a+e,o+r),i.lineTo(a+e,o+n-r),i.quadraticCurveTo(a+e,o+n,a+e-r,o+n),i.lineTo(a+r,o+n),i.quadraticCurveTo(a,o+n,a,o+n-r),i.lineTo(a,o+r),i.quadraticCurveTo(a,o,a+r,o);let s=new oo(i,{depth:t,bevelEnabled:!1,curveSegments:3});return s.rotateX(-Math.PI/2),s.translate(0,-t/2,0),s}},dd=class{constructor(e){this.scene=e,this.types=new Map}add(e,t,n,{shadow:r=!0,mat:i=Yu}={}){let a=new Ci(t,i,n);a.instanceMatrix.setUsage($e),a.instanceColor=new hi(new Float32Array(n*3).fill(1),3),a.instanceColor.setUsage($e),a.castShadow=r,a.receiveShadow=!1,a.frustumCulled=!1,a.count=0,this.scene.add(a),this.types.set(e,{mesh:a,n:0,max:n,prev:-1})}has(e){return this.types.has(e)}begin(){for(let e of this.types.values())e.n=0}put(e,t,n,r,i=0,a=1,o=null,s=0,c=0,l=a){let u=this.types.get(e);if(!u||u.n>=u.max)return;sd.set(s,i,c),od.setFromEuler(sd),ad.compose(cd.set(t,n,r),od,ld.set(a,l,a)),u.mesh.setMatrixAt(u.n,ad);let d=o||fd;u.mesh.instanceColor.setXYZ(u.n,d.r,d.g,d.b),u.n++}putMatrix(e,t,n=null){let r=this.types.get(e);if(!r||r.n>=r.max)return;r.mesh.setMatrixAt(r.n,t);let i=n||fd;r.mesh.instanceColor.setXYZ(r.n,i.r,i.g,i.b),r.n++}end(){for(let e of this.types.values()){if(e.mesh.count=e.n,e.mesh.visible=e.n>0,e.n===0&&e.prev===0||(e.prev=e.n,e.n===0))continue;let t=e.mesh.instanceMatrix,n=e.mesh.instanceColor;t.clearUpdateRanges(),t.addUpdateRange(0,e.n*16),t.needsUpdate=!0,n.clearUpdateRanges(),n.addUpdateRange(0,e.n*3),n.needsUpdate=!0}}},fd=new Gn(1,1,1);function pd(e,t,n,r=!1){let i=document.createElement(`canvas`);i.width=e,i.height=t,n(i.getContext(`2d`),e,t);let a=new Ii(i);return a.colorSpace=qe,a.anisotropy=4,r&&(a.wrapS=l,a.wrapT=l),a}function md(e){let t=e>>>0;return()=>{t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var K={active:!1,id:null,ox:0,oy:0,x:0,y:0,dx:0,dy:0,mag:0,enabled:!0,keys:new Set,onFirst:null,touched:!1},hd=56,gd=null,_d=null;function vd(e){gd=document.createElement(`div`),gd.className=`joy`,gd.innerHTML=`<div class="joy-knob"></div>`,document.getElementById(`app`).appendChild(gd),_d=gd.firstChild,e.addEventListener(`pointerdown`,t=>{if(!K.enabled||K.id!==null)return;K.id=t.pointerId;let n=e.getBoundingClientRect();K.ox=t.clientX-n.left,K.oy=t.clientY-n.top,K.x=K.ox,K.y=K.oy,K.active=!0,K.dx=K.dy=K.mag=0;try{e.setPointerCapture(t.pointerId)}catch{}gd.style.transform=`translate(${K.ox-hd}px, ${K.oy-hd}px)`,gd.classList.add(`on`),_d.style.transform=`translate(0px, 0px)`,K.touched||(K.touched=!0,K.onFirst&&K.onFirst()),t.preventDefault()}),e.addEventListener(`pointermove`,t=>{if(t.pointerId!==K.id)return;let n=e.getBoundingClientRect();K.x=t.clientX-n.left,K.y=t.clientY-n.top;let r=K.x-K.ox,i=K.y-K.oy,a=Math.hypot(r,i);if(a>hd*1.4){let e=(a-hd*1.4)/a;K.ox+=r*e,K.oy+=i*e,r=K.x-K.ox,i=K.y-K.oy,gd.style.transform=`translate(${K.ox-hd}px, ${K.oy-hd}px)`}let o=Math.hypot(r,i),s=Math.min(1,o/hd);K.mag=o<6?0:Math.min(1,.35+s*.75),K.dx=o>0?r/o:0,K.dy=o>0?i/o:0;let c=K.dx*Math.min(o,hd),l=K.dy*Math.min(o,hd);_d.style.transform=`translate(${c}px, ${l}px)`});let t=e=>{e.pointerId===K.id&&(K.id=null,K.active=!1,K.mag=0,gd.classList.remove(`on`))};e.addEventListener(`pointerup`,t),e.addEventListener(`pointercancel`,t),e.addEventListener(`lostpointercapture`,t),window.addEventListener(`keydown`,e=>K.keys.add(e.key.toLowerCase())),window.addEventListener(`keyup`,e=>K.keys.delete(e.key.toLowerCase())),window.addEventListener(`blur`,()=>{K.keys.clear(),yd()})}function yd(){K.id=null,K.active=!1,K.mag=0,gd&&gd.classList.remove(`on`)}function bd(){if(K.locked)return{dx:0,dy:0};let e=K.active?K.dx*K.mag:0,t=K.active?K.dy*K.mag:0,n=K.keys;if(n.size){let r=0,i=0;if((n.has(`arrowleft`)||n.has(`a`))&&--r,(n.has(`arrowright`)||n.has(`d`))&&(r+=1),(n.has(`arrowup`)||n.has(`w`))&&--i,(n.has(`arrowdown`)||n.has(`s`))&&(i+=1),r||i){let n=Math.hypot(r,i);e=r/n,t=i/n}}return{dx:e,dy:t}}var q=null,xd=null,Sd=null,Cd=null,wd=null,Td={sfx:!0,bgm:!0},Ed=null,Dd=!1,Od=!1,kd=null,Ad=!1,jd=0,Md=0,Nd=0,Pd={t:0,n:0},Fd={t:0,n:0},Id=2,Ld=.6,Rd=12345;function zd(){Rd|=0,Rd=Rd+1831565813|0;let e=Math.imul(Rd^Rd>>>15,1|Rd);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}function Bd(e,t){let n=e.createGain();n.gain.value=.9;let r=e.createDynamicsCompressor();r.threshold.value=-9,r.knee.value=2,r.ratio.value=20,r.attack.value=.001,r.release.value=.12;let i=e.createGain();i.gain.value=.92,n.connect(r),r.connect(i),i.connect(t);let a=e.createConvolver(),o=Math.floor(e.sampleRate*1.8),s=e.createBuffer(2,o,e.sampleRate),c=99;for(let e=0;e<2;e++){let t=s.getChannelData(e);for(let e=0;e<o;e++)c=c*1664525+1013904223>>>0,t[e]=(c/4294967296*2-1)*(1-e/o)**2.6}a.buffer=s;let l=e.createBiquadFilter();l.type=`highpass`,l.frequency.value=280,a.connect(l),l.connect(n);let u=e.createGain();u.gain.value=Id,u.connect(n);let d=e.createGain();d.gain.value=.07,u.connect(d),d.connect(a);let f=e.createGain();f.gain.value=Ld;let p=e.createGain();p.gain.value=1,f.connect(p),p.connect(n);let m=e.createGain();return m.gain.value=.16,p.connect(m),m.connect(a),{sfx:u,bgm:f,mix:n,duck:p}}function Vd(e){let t=e.createBuffer(1,Math.floor(e.sampleRate*1.5),e.sampleRate),n=t.getChannelData(0),r=777;for(let e=0;e<n.length;e++)r=r*1664525+1013904223>>>0,n[e]=r/4294967296*2-1;return t}var J={init(){if(!q)try{let e=window.AudioContext||window.webkitAudioContext;if(!e)return;q=new e;let t=Bd(q,q.destination);xd=t.sfx,Sd=t.bgm,kd=t.duck,xd.gain.value=Td.sfx?Id:0,Sd.gain.value=Td.bgm&&!Dd?Ld:0,wd=Vd(q),Kd()}catch{q=null}},resume(){q||this.init(),q&&q.state!==`running`&&q.resume().catch(()=>{})},suspend(){q&&q.state===`running`&&q.suspend().catch(()=>{})},setSfx(e){Td.sfx=e,xd&&xd.gain.setTargetAtTime(e?Id:0,q.currentTime,.05)},setBgm(e){Td.bgm=e,this.applyBgmGain()},holdBgm(e){Dd=e,this.applyBgmGain()},applyBgmGain(){Sd&&q&&Sd.gain.setTargetAtTime(Td.bgm&&!Dd?Ld:0,q.currentTime,.08)},duck(e=.8){if(!kd||!q)return;let t=q.currentTime;kd.gain.cancelScheduledValues(t),kd.gain.setTargetAtTime(.5,t,.03),kd.gain.setTargetAtTime(1,t+e,.18)},setStyle(e){Jd[e]&&Yd!==Jd[e]&&(Yd=Jd[e],Nd=0,Md=0)},setRush(e){Ad=e},get on(){return Td.sfx||Td.bgm},get debug(){return{timer:!!Ed,en:Td.bgm,held:Dd,state:q&&q.state,measuring:Od}},get bgmPlaying(){return!!Ed&&Td.bgm&&!Dd&&!!q&&q.state===`running`},startBgm(){q&&!Ed&&(jd=q.currentTime+.1,Ed=setInterval($d,50))},stopBgm(){clearInterval(Ed),Ed=null},beltLevel(e){Cd&&q&&Cd.gain.setTargetAtTime(Td.sfx?e*.09:0,q.currentTime,.2)},play(e,t=0){if(Od||!q||!Td.sfx||q.state!==`running`)return;let n=Gd[e];n&&n(q.currentTime,t)},async measure(e=[`pick`,`clack`,`coin`,`cash`,`unlock`,`happy`,`angry`,`combo`,`rush`,`error`,`step`,`pay`,`eat`,`wash`]){let t=window.OfflineAudioContext||window.webkitOfflineAudioContext;if(!t)return null;let n={ctx:q,sfxBus:xd,bgmBus:Sd,noiseBuf:wd},r={sfx:{},bgm:null},i=44100;Od=!0;try{for(let n of e){let e=new t(1,i*2,i),a=Bd(e,e.destination);q=e,xd=a.sfx,Sd=a.bgm,wd=Vd(e),Pd.n=0,Fd.n=0,Gd[n](.02,3);let o=await e.startRendering();r.sfx[n]=Hd(o.getChannelData(0))}let n=64*ef+1,a=new t(2,Math.ceil(i*n),i),o=a.createChannelMerger(2);o.connect(a.destination);let s=a.createGain();s.connect(o,0,0);let c=a.createBiquadFilter();c.type=`lowpass`,c.frequency.value=150,c.Q.value=.5;let l=a.createBiquadFilter();l.type=`lowpass`,l.frequency.value=150,l.Q.value=.5,s.connect(c),c.connect(l),l.connect(o,0,1);let u=Bd(a,s);q=a,xd=u.sfx,Sd=u.bgm,wd=Vd(a),Rd=4242;let d=Nd;Nd=0;let f=.05;for(let e=0;e<64;e++)af(f,e),f+=ef*(e%2==0?1.12:.88),(e+1)%16==0&&Nd++;Nd=d;let p=await a.startRendering(),m=p.getChannelData(0),h=p.getChannelData(1),g=Hd(m),_=0,v=0;for(let e=0;e<m.length;e++)_+=m[e]*m[e],v+=h[e]*h[e];g.lowRatio=_>0?v/_:0,r.bgm=g}finally{Od=!1,q=n.ctx,xd=n.sfxBus,Sd=n.bgmBus,wd=n.noiseBuf}return r}};function Hd(e){let t=0;for(let n=0;n<e.length;n++)t=Math.max(t,Math.abs(e[n]));let n=Math.max(.003,t*.0316),r=0,i=0;for(let t=0;t<e.length;t++)Math.abs(e[t])>n&&(i=t);for(;r<i&&Math.abs(e[r])<n;)r++;let a=0,o=Math.max(1,i-r+1);for(let t=r;t<=i;t++)a+=e[t]*e[t];let s=Math.sqrt(a/o),c=e=>e>0?20*Math.log10(e):-120;return{peakDb:+c(t).toFixed(1),rmsDb:+c(s).toFixed(1),dur:+(o/44100).toFixed(2)}}function Ud(e,t,n,r,i,a=1e-4){e.gain.setValueAtTime(1e-4,t),e.gain.exponentialRampToValueAtTime(r,t+n),e.gain.exponentialRampToValueAtTime(Math.max(a,1e-4),t+n+i)}function Y(e,t,n,{type:r=`sine`,vol:i=.3,a=.005,bus:o=xd,slide:s=0,filter:c=0}={}){let l=q.createOscillator(),u=q.createGain();l.type=r,l.frequency.setValueAtTime(t,e),s&&l.frequency.exponentialRampToValueAtTime(Math.max(20,t*s),e+n),Ud(u,e,a,i,n);let d=l;if(c){let e=q.createBiquadFilter();e.type=`lowpass`,e.frequency.value=c,l.connect(e),d=e}d.connect(u),u.connect(o),l.start(e),l.stop(e+a+n+.05)}function Wd(e,t,{vol:n=.2,type:r=`bandpass`,freq:i=1200,q:a=1,bus:o=xd,a:s=.002}={}){let c=q.createBufferSource();c.buffer=wd;let l=q.createBiquadFilter();l.type=r,l.frequency.value=i,l.Q.value=a;let u=q.createGain();Ud(u,e,s,n,t),c.connect(l),l.connect(u),u.connect(o),c.start(e,zd()*.5),c.stop(e+s+t+.05)}var Gd={step(e,t){let n=.97+zd()*.06;Wd(e,.05,{vol:.278,type:`lowpass`,freq:(t?520:440)*n}),Y(e,(t?330:290)*n,.04,{type:`triangle`,vol:.087})},pick(e,t){let n=520*1.06**Math.min(t,18)*(.97+zd()*.06);Y(e,n,.08,{type:`triangle`,vol:.3}),Y(e+.01,n*2,.05,{type:`sine`,vol:.1})},drop(e,t){Y(e,700*1.04**Math.min(t,12),.06,{type:`square`,vol:.09,filter:2400}),Wd(e,.05,{vol:.15,freq:2600,q:3})},clack(e){Y(e,1850+zd()*200,.07,{type:`sine`,vol:.224}),Y(e+.02,2600+zd()*300,.06,{type:`sine`,vol:.112}),Y(e,520,.05,{type:`triangle`,vol:.134}),Wd(e,.04,{vol:.134,freq:3500,q:3})},coin(e){e-Pd.t>.6&&(Pd.n=0),Pd.t=e,Pd.n=Math.min(Pd.n+1,24);let t=1300*1.03**Pd.n*(.97+zd()*.06);Y(e,t,.08,{type:`square`,vol:.117,filter:5e3}),Y(e+.045,t*1.5,.16,{type:`square`,vol:.104,filter:6e3}),Y(e,650,.05,{type:`triangle`,vol:.078})},pay(e){e-Fd.t>.5&&(Fd.n=0),Fd.t=e,Fd.n=Math.min(Fd.n+1,40),Y(e,600*1.025**Fd.n,.06,{type:`triangle`,vol:.16})},unlock(e){[523,659,784,1047,1319].forEach((t,n)=>Y(e+n*.07,t,.25,{type:`triangle`,vol:.12})),Y(e+.35,1568,.5,{type:`sine`,vol:.072}),[262,330,392,523,659,784].forEach(t=>Y(e+.35,t,.6,{type:`sawtooth`,vol:.021,filter:2200})),Wd(e+.3,.4,{vol:.048,freq:6e3,q:.5}),[1047,1319,1568,2093].forEach((t,n)=>Y(e+.62+n*.05,t,.18,{type:`square`,vol:.03,filter:5e3}));for(let t=0;t<8;t++)Y(e+.4+t*.045,1500+t*90+zd()*60,.07,{type:`square`,vol:.025,filter:6e3})},pop(e){Y(e,300,.12,{type:`sine`,vol:.3,slide:3}),Y(e,600,.08,{type:`triangle`,vol:.1,slide:2})},happy(e){Y(e,880,.1,{type:`triangle`,vol:.2}),Y(e+.08,1175,.16,{type:`triangle`,vol:.2}),Y(e,440,.12,{type:`sine`,vol:.06})},angry(e){Y(e,180,.25,{type:`sawtooth`,vol:.16,slide:.7,filter:1200}),Y(e+.12,150,.3,{type:`sawtooth`,vol:.16,slide:.7,filter:1e3}),Y(e,360,.3,{type:`square`,vol:.04,slide:.7,filter:900})},eat(e){Wd(e,.05,{vol:.585,freq:900,q:2}),Wd(e+.09,.05,{vol:.488,freq:1100,q:2})},combo(e,t){let n=660*1.059**Math.min(t,12);[1,1.25,1.5].forEach((t,r)=>Y(e+r*.045,n*t,.12,{type:`triangle`,vol:.162})),Y(e,n/2,.2,{type:`sine`,vol:.054})},rush(e){for(let t=0;t<4;t++)Y(e+t*.16,110,.18,{type:`sine`,vol:.165,slide:.5}),Y(e+t*.16,330,.12,{type:`triangle`,vol:.077,slide:.6}),Wd(e+t*.16,.08,{vol:.11,type:`bandpass`,freq:450,q:1.2});Y(e+.66,880,.3,{type:`square`,vol:.039,filter:3e3})},vip(e){[220,331,441,662].forEach((t,n)=>Y(e,t,1.2,{type:`sine`,vol:n===3?.05:.12})),Y(e,1320,.8,{type:`sine`,vol:.018})},wash(e){Wd(e,.12,{vol:.14,freq:1800,q:.8}),Y(e+.03,900+zd()*400,.05,{type:`sine`,vol:.08,slide:1.8})},dry(e){Y(e,400,.15,{type:`sine`,vol:.16,slide:.5})},error(e){Y(e,220,.12,{type:`square`,vol:.108,filter:1500}),Y(e+.12,180,.15,{type:`square`,vol:.108,filter:1500})},click(e){Y(e,900,.05,{type:`triangle`,vol:.18})},open(e){Y(e,500,.08,{type:`triangle`,vol:.15,slide:1.6})},cook(e){Y(e,1400,.05,{type:`sine`,vol:.08}),Y(e+.05,1760,.08,{type:`sine`,vol:.08})},whoosh(e){Wd(e,.25,{vol:.18,freq:900,q:.7,a:.08})},cash(e){Y(e,1568,.08,{type:`square`,vol:.1,filter:5e3}),Y(e+.07,2093,.25,{type:`square`,vol:.1,filter:6e3}),Y(e,523,.1,{type:`triangle`,vol:.125}),Wd(e,.08,{vol:.1,freq:5e3,q:2})}};function Kd(){Cd=q.createGain(),Cd.gain.value=0;let e=q.createBufferSource();e.buffer=wd,e.loop=!0;let t=q.createBiquadFilter();t.type=`bandpass`,t.frequency.value=380,t.Q.value=.8;let n=q.createOscillator();n.frequency.value=3.2;let r=q.createGain();r.gain.value=.5;let i=q.createGain();i.gain.value=.6,n.connect(r),r.connect(i.gain),e.connect(t),t.connect(i),i.connect(Cd),Cd.connect(xd),e.start(),n.start()}var qd=e=>440*2**((e-69)/12),Jd={alley:{bpm:78,swing:.12,scale:[62,63,67,69,70,74,75,79,81],A:[[50,57,60,65],[46,58,62,65],[43,58,62,65],[45,55,61,64]],B:[[46,58,62,65],[48,55,60,64],[50,57,60,65],[45,55,61,64]],lead:`koto`,drums:`lofi`,pad:`saw`},mall:{bpm:110,swing:0,scale:[72,74,76,79,81,84,86,88,91],A:[[48,60,64,67],[43,59,62,67],[45,60,64,69],[41,60,65,69]],B:[[41,60,65,69],[43,59,62,67],[48,60,64,67],[43,62,65,71]],lead:`synth`,drums:`four`,pad:`square`},beach:{bpm:96,swing:.1,scale:[65,67,69,72,74,77,79,81,84],A:[[41,57,60,65],[46,58,62,65],[48,58,60,64],[41,57,60,65]],B:[[50,57,62,65],[46,58,62,65],[48,55,60,64],[48,58,60,64]],lead:`uke`,drums:`shaker`,pad:`strum`},ryokan:{bpm:64,swing:0,scale:[64,65,69,71,72,76,77,81,83],A:[[40,52,59,64],[41,53,57,64],[45,52,57,60],[40,52,59,64]],B:[[45,57,60,64],[41,53,57,65],[47,54,59,62],[40,52,59,64]],lead:`koto2`,drums:`taiko`,pad:`flute`},space:{bpm:100,swing:0,scale:[69,72,74,76,79,81,84,86,88],A:[[45,57,60,64],[41,57,60,65],[43,55,59,62],[40,55,59,64]],B:[[41,53,57,60],[43,55,59,62],[45,57,60,64],[40,56,59,64]],lead:`arp`,drums:`soft`,pad:`saw`}},Yd=Jd.alley,Xd=4,Zd=null;function Qd(){return 60/(Yd.bpm*(Ad?1.15:1))/4}function $d(){if(q&&!Od)for(;jd<q.currentTime+.25;)Dd||af(jd,Md),jd+=Qd()*(Md%2==0?1+Yd.swing:1-Yd.swing),Md++,Md%16==0&&Nd++}var ef=60/78/4;function tf(e,t,n,r=.5,i=`koto`){let a=q.createOscillator(),o=q.createOscillator(),s=q.createGain(),c=q.createBiquadFilter();a.type=i===`synth`?`square`:`triangle`,o.type=`sine`,a.frequency.value=t,o.frequency.value=t*(i===`uke`?3.01:2.01),i===`koto2`&&(a.frequency.setValueAtTime(t*.97,e),a.frequency.linearRampToValueAtTime(t,e+.08)),c.type=`lowpass`,c.frequency.setValueAtTime(i===`synth`?2600:3200,e),c.frequency.exponentialRampToValueAtTime(i===`uke`?900:600,e+r),Ud(s,e,.004,i===`synth`?n*.5:n,r),a.connect(c),o.connect(c),c.connect(s),s.connect(Sd),a.start(e),o.start(e),a.stop(e+r+.1),o.stop(e+r+.1)}function nf(e,t=.22){let n=q.createOscillator(),r=q.createGain();n.frequency.setValueAtTime(120,e),n.frequency.exponentialRampToValueAtTime(50,e+.12),Ud(r,e,.003,t,.14),n.connect(r),r.connect(Sd),n.start(e),n.stop(e+.25),Y(e,260,.04,{type:`triangle`,vol:.14,bus:Sd,slide:.6})}function rf(e,t){Y(e,95,.3,{type:`sine`,vol:t*.8,bus:Sd,slide:.6}),Y(e,290,.14,{type:`triangle`,vol:t*.5,bus:Sd,slide:.7}),Wd(e,.06,{vol:t*.5,type:`bandpass`,freq:420,q:1.2,bus:Sd})}function af(e,t){let n=t%16,r=Nd%16<8?`A`:`B`,i=Yd[r][Nd%4].map(qd),a=Qd(),o=Yd.drums;if(o===`lofi`?((n===0||n===10)&&nf(e),(n===4||n===12)&&Wd(e,.12,{vol:.16,freq:1800,q:.7,bus:Sd}),n%2==0&&Wd(e,.03,{vol:n%4==2?.07:.045,type:`highpass`,freq:7e3,bus:Sd})):o===`four`?(n%4==0&&nf(e,.2),(n===4||n===12)&&Wd(e,.1,{vol:.15,freq:2200,q:.8,bus:Sd}),n%2==1&&Wd(e,.03,{vol:.06,type:`highpass`,freq:8e3,bus:Sd})):o===`shaker`?((n===0||n===8)&&nf(e,.18),Wd(e,.04,{vol:n%2?.035:.06,type:`highpass`,freq:6e3,bus:Sd}),(n===6||n===14)&&Wd(e,.05,{vol:.1,freq:1200,q:3,bus:Sd})):o===`taiko`?(n===0&&rf(e,.3),n===10&&Nd%2&&rf(e,.18),n===8&&Wd(e,.02,{vol:.08,freq:3e3,q:4,bus:Sd})):o===`soft`&&((n===0||n===8)&&nf(e,.18),n%4==2&&Wd(e,.05,{vol:.05,type:`highpass`,freq:6e3,bus:Sd})),Ad&&(n===0||n===6||n===8||n===11)&&rf(e,.2),n===0||n===7||n===10){let t=i[0];Y(e,t,.35,{type:`sine`,vol:.15,bus:Sd}),Y(e,t*2,.3,{type:`triangle`,vol:.13,bus:Sd}),Y(e,t*3,.22,{type:`sine`,vol:.06,bus:Sd}),Y(e,t*4,.18,{type:`sine`,vol:.04,bus:Sd})}let s=Yd.pad;if(s===`strum`){if(n%4==2)for(let t=1;t<4;t++)tf(e+t*.012,i[t],.05,.25,`uke`)}else if(n===0){let t=s===`square`?`square`:s===`flute`?`sine`:`sawtooth`;for(let n=1;n<4;n++)Y(e,i[n],a*15,{type:t,vol:s===`flute`?.05:.03,a:.3,bus:Sd,filter:s===`square`?1400:1100})}let c=Yd.scale.map(qd);if(!Zd||Zd.style!==Yd){Zd={style:Yd,notes:[]};let e=4;for(let t=0;t<16;t++)e=Math.max(0,Math.min(c.length-1,e+Math.floor(zd()*5)-2)),Zd.notes.push([1,0,0,1,0,0,1,0,1,0,0,0,1,0,1,0][t]?e:-1)}let l=Yd.lead;if(l===`arp`){n%2==0&&tf(e,[i[1]*2,i[2]*2,i[3]*2,i[2]*4][n/2%4],.07,.18,`synth`),r===`B`&&(n===0||n===8)&&zd()<.7&&tf(e,c[Math.floor(zd()*c.length)],.1,.8,`koto`);return}let u=l===`uke`?.28:l===`koto2`?1:.6;if(r===`A`){let t=Zd.notes[n];t>=0&&(Nd%4==3&&n>=8&&(t=Math.min(c.length-1,t+2)),tf(e,c[t],.13,u,l))}else[1,0,1,0,0,1,0,0,1,0,1,0,0,0,1,0][n]&&zd()<.75&&(Xd+=Math.floor(zd()*5)-2,Xd=Math.max(0,Math.min(c.length-1,Xd)),tf(e,c[Xd],.12,u,l));n%4==0&&zd()<.4&&Wd(e+zd()*.1,.01,{vol:.04,type:`highpass`,freq:3e3,bus:Sd})}var of=`sushi-loop-save`,X={chef:{speed:3.5,speedPerLvl:.12,cap:8,capPerLvl:3,radius:.34},transfer:.07,fastTransfer:.045,billTick:.03,crate:{max:10,regen:.75},station:{inCap:10,outCap:8,cookTime:1.5,cookPerLvl:.86},sink:{washTime:.55},belt:{spacing:.92,speed:.95,speedPerLvl:.2,dryLaps:3,grab:.28},cust:{patience:90,eat:2.4,seatCycle:28,maxOrders:3,walk:2.3,firstDelay:1.5},combo:{fast:10,tipPer:.1,maxMul:3,slow:22},rush:{first:75,min:95,max:140},staff:{speed:2.5,cap:3,speedPerLvl:.14,capPerLvl:1},offline:{capHours:2,minSec:120,share:.45},plates:10,platesPerSeat:2,platesPerLvl:4,unlockTime:1.25,autosave:5},sf={salmon:{name:`연어 초밥`,ing:`salmon`,price:10,plate:`#ff9a3c`,desc:`기름진 연어를 얹은 대표 메뉴`},tamago:{name:`달걀 초밥`,ing:`egg`,price:14,plate:`#ffd23f`,desc:`달콤한 두툼 계란말이 초밥`},tuna:{name:`참치 초밥`,ing:`tuna`,price:20,plate:`#e2394f`,desc:`진한 붉은살 참치`},ebi:{name:`새우튀김`,ing:`shrimp`,price:18,plate:`#4fb0ff`,desc:`바삭한 튀김옷의 왕새우`},udon:{name:`우동 그릇`,ing:`noodle`,price:22,plate:`#7a5cff`,desc:`따끈한 국물의 쫄깃한 면`,bowl:!0},uni:{name:`성게 군함`,ing:`uni`,price:26,plate:`#1fbf8f`,desc:`김으로 감싼 바다의 버터`},unagi:{name:`장어 초밥`,ing:`eel`,price:28,plate:`#2b2b2b`,desc:`달콤 짭짤한 소스의 장어`},dessert:{name:`딸기 모찌`,ing:`berry`,price:20,plate:`#ff7ab8`,desc:`말랑한 찹쌀떡 디저트`},ikura:{name:`연어알 군함`,ing:`roe`,price:30,plate:`#c0c7d6`,desc:`톡톡 터지는 연어알`},star:{name:`은하 젤리`,ing:`star`,price:36,plate:`#9b6bff`,desc:`무중력에서 굳힌 별빛 젤리`}},cf=[`salmon`,`tamago`,`tuna`,`ebi`,`udon`,`uni`,`unagi`,`dessert`,`ikura`,`star`],lf={salmon:{name:`연어`,color:`#ff8a4c`},egg:{name:`달걀`,color:`#ffd84a`},tuna:{name:`참치`,color:`#c9243d`},shrimp:{name:`새우`,color:`#ff9f7a`},noodle:{name:`면`,color:`#f3e2b5`},uni:{name:`성게`,color:`#ffb52e`},eel:{name:`장어`,color:`#7a4a2a`},berry:{name:`딸기`,color:`#ff4f6d`},roe:{name:`연어알`,color:`#ff6a1f`},star:{name:`별가루`,color:`#b58cff`}},uf=[{id:`speed`,name:`이동 속도`,icon:`run`,max:6,base:60,growth:1.6,tab:`chef`,desc:`셰프 이동 속도 +12%`},{id:`cap`,name:`적재량`,icon:`stack`,max:6,base:80,growth:1.6,tab:`chef`,desc:`한 번에 +3개 더 운반`},{id:`cook`,name:`조리 속도`,icon:`fire`,max:6,base:90,growth:1.6,tab:`shop`,desc:`조리 시간 14% 단축`},{id:`belt`,name:`벨트 속도`,icon:`belt`,max:5,base:100,growth:1.65,tab:`shop`,desc:`벨트가 더 빨리 돌아감`},{id:`plates`,name:`접시 추가`,icon:`plate`,max:6,base:70,growth:1.55,tab:`shop`,desc:`깨끗한 접시 +4장`},{id:`sspeed`,name:`직원 속도`,icon:`run`,max:5,base:120,growth:1.6,tab:`staff`,desc:`직원 이동 속도 +14%`,needStaff:!0},{id:`scap`,name:`직원 적재량`,icon:`stack`,max:4,base:140,growth:1.65,tab:`staff`,desc:`직원이 +1개 더 운반`,needStaff:!0}],df=[{id:`alley`,name:`골목 포장마차`,sub:`밤골목 작은 회전초밥`,priceMul:1,cust:1,theme:`alley`,layout:{r:1.5,len0:3,len1:5,topZ:-3,twoBelts:!1,mirror:!1,menus:[`salmon`,`tamago`,`tuna`]},start:{menus:[`salmon`],seats:[`A-R-0`,`A-R-1`]},unlocks:[{id:`s1`,t:`seats`,seats:[`A-L-0`,`A-L-1`],cost:10},{id:`sink`,t:`sink`,cost:30},{id:`st_tamago`,t:`station`,menu:`tamago`,cost:50},{id:`upg`,t:`upgrade`,cost:70},{id:`run1`,t:`staff`,role:`runner`,cost:100},{id:`s2`,t:`seats`,seats:[`A-R-2`,`A-L-2`],cost:130},{id:`haul1`,t:`staff`,role:`hauler`,cost:170},{id:`st_tuna`,t:`station`,menu:`tuna`,cost:220},{id:`ext`,t:`extend`,cost:210},{id:`s3`,t:`seats`,seats:[`A-R-3`,`A-R-4`],cost:260},{id:`s4`,t:`seats`,seats:[`A-L-3`,`A-L-4`],cost:320},{id:`run2`,t:`staff`,role:`runner`,cost:420},{id:`next`,t:`next`,cost:700}]},{id:`mall`,costMul:.55,name:`쇼핑몰 푸드코트`,sub:`북적이는 주말의 쇼핑몰`,priceMul:4,cust:1.1,theme:`mall`,layout:{r:1.6,len0:3,len1:5,topZ:-3,twoBelts:!0,mirror:!1,menus:[`salmon`,`tuna`,`ebi`,`udon`]},start:{menus:[`salmon`],seats:[`A-R-0`,`A-R-1`]},unlocks:[{id:`s1`,t:`seats`,seats:[`A-L-0`,`A-L-1`],cost:45},{id:`sink`,t:`sink`,cost:110},{id:`run1`,t:`staff`,role:`runner`,cost:180},{id:`st_tuna`,t:`station`,menu:`tuna`,cost:240},{id:`upg`,t:`upgrade`,cost:330},{id:`haul1`,t:`staff`,role:`hauler`,cost:450},{id:`s2`,t:`seats`,seats:[`A-R-2`,`A-L-2`],cost:600},{id:`st_ebi`,t:`station`,menu:`ebi`,cost:800},{id:`lever`,t:`lever`,seats:[`B-L-0`,`B-L-1`],cost:1e3},{id:`s3`,t:`seats`,seats:[`B-R-0`,`B-R-1`],cost:1200},{id:`st_udon`,t:`station`,menu:`udon`,cost:1500},{id:`ext`,t:`extend`,cost:1800},{id:`s4`,t:`seats`,seats:[`A-R-3`,`A-L-3`],cost:2100},{id:`run2`,t:`staff`,role:`runner`,cost:2500},{id:`s5`,t:`seats`,seats:[`B-L-2`,`B-R-2`],cost:2900},{id:`s6`,t:`seats`,seats:[`B-R-3`,`B-L-3`],cost:3400},{id:`haul2`,t:`staff`,role:`hauler`,cost:4e3},{id:`next`,t:`next`,cost:6e3}]},{id:`beach`,costMul:.55,name:`바닷가 스시바`,sub:`파도 소리 들리는 해변`,priceMul:11,cust:1.2,theme:`beach`,layout:{r:1.5,len0:3,len1:5,topZ:-3,twoBelts:!0,mirror:!0,gap:3.7,bOff:1.6,menus:[`salmon`,`uni`,`ebi`,`unagi`,`dessert`]},start:{menus:[`salmon`],seats:[`A-R-0`,`A-R-1`]},unlocks:[{id:`s1`,t:`seats`,seats:[`A-L-0`,`A-L-1`],cost:120},{id:`sink`,t:`sink`,cost:280},{id:`run1`,t:`staff`,role:`runner`,cost:450},{id:`st_uni`,t:`station`,menu:`uni`,cost:600},{id:`upg`,t:`upgrade`,cost:850},{id:`haul1`,t:`staff`,role:`hauler`,cost:1100},{id:`s2`,t:`seats`,seats:[`A-R-2`,`A-L-2`],cost:1500},{id:`st_ebi`,t:`station`,menu:`ebi`,cost:2e3},{id:`lever`,t:`lever`,seats:[`B-L-0`,`B-L-1`],cost:2500},{id:`st_unagi`,t:`station`,menu:`unagi`,cost:3100},{id:`s3`,t:`seats`,seats:[`B-R-0`,`B-R-1`],cost:3800},{id:`ext`,t:`extend`,cost:4500},{id:`run2`,t:`staff`,role:`runner`,cost:5400},{id:`st_dessert`,t:`station`,menu:`dessert`,cost:6400},{id:`s4`,t:`seats`,seats:[`A-R-3`,`A-L-3`],cost:7500},{id:`s5`,t:`seats`,seats:[`B-L-2`,`B-R-2`],cost:8800},{id:`haul2`,t:`staff`,role:`hauler`,cost:1e4},{id:`next`,t:`next`,cost:15e3}]},{id:`ryokan`,costMul:.55,name:`고급 료칸`,sub:`대나무 숲 속 오마카세`,priceMul:28,cust:1.3,theme:`ryokan`,layout:{r:1.8,len0:2.6,len1:4.4,topZ:-3,twoBelts:!0,mirror:!1,gap:4.3,menus:[`tuna`,`unagi`,`uni`,`ikura`,`dessert`]},start:{menus:[`tuna`],seats:[`A-R-0`,`A-R-1`]},unlocks:[{id:`s1`,t:`seats`,seats:[`A-L-0`,`A-L-1`],cost:300},{id:`sink`,t:`sink`,cost:700},{id:`run1`,t:`staff`,role:`runner`,cost:1100},{id:`st_unagi`,t:`station`,menu:`unagi`,cost:1500},{id:`upg`,t:`upgrade`,cost:2100},{id:`haul1`,t:`staff`,role:`hauler`,cost:2800},{id:`s2`,t:`seats`,seats:[`A-R-2`,`A-L-2`],cost:3700},{id:`st_uni`,t:`station`,menu:`uni`,cost:4800},{id:`lever`,t:`lever`,seats:[`B-L-0`,`B-L-1`],cost:6e3},{id:`st_ikura`,t:`station`,menu:`ikura`,cost:7500},{id:`s3`,t:`seats`,seats:[`B-R-0`,`B-R-1`],cost:9e3},{id:`ext`,t:`extend`,cost:11e3},{id:`run2`,t:`staff`,role:`runner`,cost:13e3},{id:`st_dessert`,t:`station`,menu:`dessert`,cost:15500},{id:`s4`,t:`seats`,seats:[`A-R-3`,`A-L-3`],cost:18e3},{id:`s5`,t:`seats`,seats:[`B-L-2`,`B-R-2`],cost:21e3},{id:`haul2`,t:`staff`,role:`hauler`,cost:25e3},{id:`next`,t:`next`,cost:38e3}]},{id:`space`,costMul:.55,name:`우주 정거장`,sub:`궤도 위 무중력 회전초밥`,priceMul:70,cust:1.4,theme:`space`,layout:{r:1.6,len0:3.4,len1:5.4,topZ:-3,twoBelts:!0,mirror:!0,gap:4.1,bOff:-.8,menus:[`star`,`salmon`,`tuna`,`uni`,`dessert`]},start:{menus:[`star`],seats:[`A-R-0`,`A-R-1`]},unlocks:[{id:`s1`,t:`seats`,seats:[`A-L-0`,`A-L-1`],cost:800},{id:`sink`,t:`sink`,cost:1800},{id:`run1`,t:`staff`,role:`runner`,cost:2800},{id:`st_salmon`,t:`station`,menu:`salmon`,cost:3800},{id:`upg`,t:`upgrade`,cost:5e3},{id:`haul1`,t:`staff`,role:`hauler`,cost:6800},{id:`s2`,t:`seats`,seats:[`A-R-2`,`A-L-2`],cost:9e3},{id:`st_tuna`,t:`station`,menu:`tuna`,cost:12e3},{id:`lever`,t:`lever`,seats:[`B-L-0`,`B-L-1`],cost:15e3},{id:`st_uni`,t:`station`,menu:`uni`,cost:19e3},{id:`s3`,t:`seats`,seats:[`B-R-0`,`B-R-1`],cost:23e3},{id:`ext`,t:`extend`,cost:28e3},{id:`run2`,t:`staff`,role:`runner`,cost:33e3},{id:`st_dessert`,t:`station`,menu:`dessert`,cost:39e3},{id:`s4`,t:`seats`,seats:[`A-R-3`,`A-L-3`],cost:46e3},{id:`s5`,t:`seats`,seats:[`B-L-2`,`B-R-2`],cost:54e3},{id:`haul2`,t:`staff`,role:`hauler`,cost:64e3},{id:`final`,t:`final`,cost:1e5}]}];for(let e of df)if(e.costMul)for(let t of e.unlocks){let n=t.cost*e.costMul,r=n>=1e4?500:n>=1e3?50:5;t.cost=Math.max(r,Math.round(n/r)*r)}var ff={alley:{bg:`#1c2040`,fog:`#1c2040`,floor:`planks`,floorColor:`#b98a5a`,ground:`#34364a`,groundTex:`asphalt`,wall:`#6b3a2a`,wallTrim:`#3a1f18`,counter:`#d8a86a`,counterTop:`#f1d7a8`,noren:`#23407a`,lantern:`#ff5a3c`,accent:`#e8483b`,light:16769720,hemiSky:12372223,hemiGround:7031354,sun:1.55,hemi:1.15,props:`alley`},mall:{bg:`#a9dcf2`,fog:`#a9dcf2`,floor:`tiles`,floorColor:`#f2eee6`,ground:`#d7dde3`,groundTex:`tiles`,wall:`#f7f3ea`,wallTrim:`#58c7b4`,counter:`#e9e3d6`,counterTop:`#ffffff`,noren:`#1aa493`,lantern:`#ffffff`,accent:`#ff6b5a`,light:16777215,hemiSky:15267583,hemiGround:10134701,sun:1.5,hemi:1.2,props:`mall`},beach:{bg:`#8fdcff`,fog:`#8fdcff`,floor:`planks`,floorColor:`#e2c08c`,ground:`#f3d9a2`,groundTex:`sand`,wall:`#57b8c9`,wallTrim:`#f7f3ea`,counter:`#c98b4e`,counterTop:`#f6e0b4`,noren:`#ff7a3a`,lantern:`#ffd23f`,accent:`#ff7a3a`,light:16773848,hemiSky:13627647,hemiGround:13214826,sun:1.65,hemi:1.15,props:`beach`},ryokan:{bg:`#243428`,fog:`#243428`,floor:`tatami`,floorColor:`#d5c98a`,ground:`#4a5a44`,groundTex:`gravel`,wall:`#3b2a22`,wallTrim:`#f3ead2`,counter:`#8a5a3a`,counterTop:`#e6c99a`,noren:`#5a2d7a`,lantern:`#ffcf7a`,accent:`#c9a24a`,light:16769200,hemiSky:14280904,hemiGround:5917232,sun:1.45,hemi:1.1,props:`ryokan`},space:{bg:`#0b0d24`,fog:`#0b0d24`,floor:`metal`,floorColor:`#aab4c8`,ground:`#1a1d38`,groundTex:`void`,wall:`#3a4466`,wallTrim:`#3de0ff`,counter:`#dfe6f2`,counterTop:`#ffffff`,noren:`#ff3fa4`,lantern:`#3de0ff`,accent:`#3de0ff`,light:15265535,hemiSky:13161727,hemiGround:3813472,sun:1.5,hemi:1.25,props:`space`}},pf=[{id:`base`,name:`기본 인테리어`,price:0,over:{}},{id:`sakura`,name:`벚꽃 인테리어`,price:60,over:{noren:`#ff8fb8`,lantern:`#ffc2d8`,counter:`#e8b4b8`,floorTint:`#ffd9e4`}},{id:`indigo`,name:`쪽빛 인테리어`,price:90,over:{noren:`#1d2f6f`,lantern:`#8fb0ff`,counter:`#5b6ea8`,floorTint:`#b8c4ff`}},{id:`gold`,name:`황금 인테리어`,price:160,over:{noren:`#1a1a1a`,lantern:`#ffd23f`,counter:`#e0b040`,floorTint:`#ffe8a0`}}],mf=[{id:`chef`,name:`셰프 모자`,price:0},{id:`band`,name:`머리띠 하치마키`,price:25},{id:`cat`,name:`고양이 귀`,price:50},{id:`pirate`,name:`해적 모자`,price:80},{id:`crown`,name:`황금 왕관`,price:140},{id:`helmet`,name:`우주 헬멧`,price:200}],hf=[{id:`white`,name:`흰 앞치마`,price:0,color:`#ffffff`},{id:`navy`,name:`남색 앞치마`,price:20,color:`#27407a`},{id:`red`,name:`빨간 앞치마`,price:35,color:`#e2394f`},{id:`pink`,name:`분홍 앞치마`,price:45,color:`#ff8fb8`},{id:`black`,name:`검은 앞치마`,price:70,color:`#2a2a2e`},{id:`gold`,name:`금빛 앞치마`,price:150,color:`#f2c230`}],gf=[{id:`plate1`,name:`첫 접시`,desc:`초밥 1접시 판매`,stat:`plates`,goal:1,reward:5},{id:`plate100`,name:`단골 가게`,desc:`초밥 100접시 판매`,stat:`plates`,goal:100,reward:15},{id:`plate1000`,name:`초밥 장인`,desc:`초밥 1,000접시 판매`,stat:`plates`,goal:1e3,reward:40},{id:`cust50`,name:`입소문`,desc:`손님 50명 접대`,stat:`customers`,goal:50,reward:10},{id:`cust500`,name:`줄 서는 맛집`,desc:`손님 500명 접대`,stat:`customers`,goal:500,reward:30},{id:`unlock1`,name:`첫 확장`,desc:`해금 발판 1개 완료`,stat:`unlocks`,goal:1,reward:5},{id:`unlock20`,name:`인테리어 공사`,desc:`해금 발판 20개 완료`,stat:`unlocks`,goal:20,reward:25},{id:`staff1`,name:`사장님`,desc:`첫 직원 고용`,stat:`staff`,goal:1,reward:10},{id:`combo10`,name:`타이밍 장인`,desc:`콤보 10 달성`,stat:`maxCombo`,goal:10,reward:15},{id:`combo25`,name:`회전의 달인`,desc:`콤보 25 달성`,stat:`maxCombo`,goal:25,reward:30},{id:`vip1`,name:`VIP 대접`,desc:`VIP 세트 완벽 서빙`,stat:`vip`,goal:1,reward:10},{id:`vip10`,name:`미슐랭 후보`,desc:`VIP 세트 10번 완료`,stat:`vip`,goal:10,reward:35},{id:`wash300`,name:`반짝반짝`,desc:`접시 300장 설거지`,stat:`washed`,goal:300,reward:20},{id:`dry20`,name:`위생 관리`,desc:`마른 접시 20개 수거`,stat:`dried`,goal:20,reward:10},{id:`earn10k`,name:`만원의 행복`,desc:`누적 수익 10K`,stat:`earned`,goal:1e4,reward:20},{id:`earn1m`,name:`백만장자`,desc:`누적 수익 1M`,stat:`earned`,goal:1e6,reward:60},{id:`stage2`,name:`2호점 오픈`,desc:`쇼핑몰로 이전`,stat:`stage`,goal:2,reward:25},{id:`stage3`,name:`바다 전망`,desc:`바닷가로 이전`,stat:`stage`,goal:3,reward:35},{id:`stage4`,name:`오마카세`,desc:`료칸으로 이전`,stat:`stage`,goal:4,reward:45},{id:`stage5`,name:`우주 진출`,desc:`우주 정거장으로 이전`,stat:`stage`,goal:5,reward:60},{id:`star5`,name:`별 다섯 개`,desc:`식당 별점 4.8 이상`,stat:`bestStars`,goal:4.8,reward:20},{id:`rush10`,name:`러시 마스터`,desc:`러시 타임 10번 버티기`,stat:`rushes`,goal:10,reward:20}],_f=[{type:`plates`,text:`초밥 {n}접시 판매`,base:40,reward:8},{type:`customers`,text:`손님 {n}명 접대`,base:15,reward:8},{type:`earned`,text:`돈 {n} 벌기`,base:300,reward:10,money:!0},{type:`unlocks`,text:`해금 발판 {n}개 완료`,base:2,reward:10},{type:`combo`,text:`콤보 {n} 달성`,base:6,reward:10,max:!0},{type:`washed`,text:`접시 {n}장 설거지`,base:30,reward:8},{type:`vip`,text:`VIP 세트 {n}번 완료`,base:1,reward:12},{type:`dried`,text:`마른 접시 {n}개 수거`,base:3,reward:8}],vf=[{pearls:10},{pearls:15},{money:1},{pearls:20},{pearls:25},{money:2},{pearls:50,hat:`band`}],yf=[{id:`tip`,name:`단골 인심`,desc:`모든 식당 팁 +5%`,max:5,base:30,step:25},{id:`cap`,name:`튼튼한 팔`,desc:`시작 적재량 +1`,max:3,base:40,step:40},{id:`offline`,name:`믿음직한 점장`,desc:`자리 비운 수익 상한 +30분`,max:4,base:35,step:30},{id:`patience`,name:`따뜻한 차`,desc:`손님 인내심 +8%`,max:3,base:45,step:35}];function bf(e=new Date){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function xf(){return{money:0,earned:0,done:[],paid:{},upg:{},st:{},cr:{},sinkQ:0,belts:{},stack:[],seats:{},hist:[.7,.7,.7,.7,.7,.7],combo:0,rushT:0,time:0,cust:0,plates:0,bestCombo:0,staff:[]}}function Sf(){return{v:4,created:Date.now(),lastSeen:Date.now(),pearls:0,stage:0,run:xf(),records:[],stats:{plates:0,customers:0,earned:0,unlocks:0,staff:0,maxCombo:0,vip:0,washed:0,dried:0,stage:1,bestStars:0,rushes:0,playSec:0,offline:0,angry:0},ach:{},missions:{day:``,list:[]},attend:{last:``,day:0},cos:{hats:[`chef`],aprons:[`white`],skins:[`base`],hat:`chef`,apron:`white`,skin:`base`},dex:{},settings:{sfx:!0,bgm:!0,haptic:!0,shadows:!0,qLocked:!1},tut:0,perks:{},season:1,doubleDay:``,finished:!1}}function Cf(e){if(!e||typeof e!=`object`)return null;let t=Number(e.v)||1;return t<2&&(e.run=e.run||xf(),typeof e.money==`number`&&(e.run.money=e.money),delete e.money,t=2),t<3&&(e.cos=e.cos||{},e.cos.skins=e.cos.skins||[`base`],e.cos.skin=e.cos.skin||`base`,t=3),t<4&&(e.perks=e.perks||{},e.season=e.season||1,t=4),e.v=4,e}function wf(e){let t=Sf(),n=Tf(t,e),r=n.run,i=xf();for(let e of Object.keys(i))(typeof r[e]!=typeof i[e]||Array.isArray(i[e])&&!Array.isArray(r[e]))&&(r[e]=i[e]);let a=(e,t=0)=>Number.isFinite(e)?e:t;r.money=Math.max(0,a(r.money)),r.earned=Math.max(0,a(r.earned)),n.pearls=Math.max(0,a(n.pearls)),n.stage=Math.max(0,Math.min(4,Math.floor(a(n.stage)))),n.season=Math.max(1,Math.floor(a(n.season,1))),(!n.perks||typeof n.perks!=`object`)&&(n.perks={}),(!Array.isArray(r.hist)||!r.hist.length)&&(r.hist=i.hist),r.hist=r.hist.filter(e=>Number.isFinite(e)).slice(-20),r.hist.length||(r.hist=i.hist),r.stack=r.stack.filter(e=>e&&typeof e==`object`&&typeof e.k==`string`),Array.isArray(n.records)||(n.records=[]);for(let e of Object.keys(n.stats))n.stats[e]=a(n.stats[e],t.stats[e]??0);return n}function Tf(e,t){if(Array.isArray(e))return Array.isArray(t)?t:e;if(e&&typeof e==`object`){let n={...e};if(t&&typeof t==`object`&&!Array.isArray(t))for(let r of Object.keys(t))n[r]=r in e?Tf(e[r],t[r]):t[r];return n}return t===void 0||typeof t!=typeof e?e:t}function Ef(){let e=null;try{e=localStorage.getItem(of)}catch{e=null}if(!e)return{profile:Sf(),fresh:!0};try{let t=Cf(JSON.parse(e));if(!t)throw Error(`bad`);return{profile:wf(t),fresh:!1}}catch{try{localStorage.setItem(of+`-corrupt`,e)}catch{}return{profile:Sf(),fresh:!0,corrupt:!0}}}function Df(e){try{return e.v=4,localStorage.setItem(of,JSON.stringify(e)),!0}catch{return!1}}function Of(){try{localStorage.removeItem(of)}catch{}}var kf=.5,Af=.85,jf=1.28;function Mf(e){let t=e.layout,n=t.mirror?-1:1,r=t.r,i=t.topZ,a=t.menus.length,o=2.6,s=i-r-5.2,c=s-2.55,l=t.gap||3.9,u=t.bOff||0,d=(t.twoBelts?[-l*n,l*n]:[0]).map((e,n)=>({id:n===0?`A`:`B`,cx:e,topZ:i+(n===1?u:0),r,len0:t.len0,len1:t.len1})),f=(a-1)/2*o,p=t.menus.map((e,t)=>{let r=(-f+t*o)*n;return{menu:e,ing:sf[e].ing,x:r,z:s,padIn:{x:r-.63,z:s+1.2},padOut:{x:r+.63,z:s+1.2},crate:{x:r+1.3*n,z:c,pad:{x:r+1.3*n,z:c+1.05}}}}),m=(f+2.15)*n,h=(f+3.95)*n,g={x:m,z:s},_={x:h,z:s,pad:{x:h,z:s+1.2}},v=Math.max(t.twoBelts?l+4.7:6.4,Math.abs(h)+1.6),y=i+Math.max(0,u)+t.len1+r+4.4,b=c-1.2,x=d.map(e=>({x:e.cx,z:e.topZ-r-1.35,belt:e.id})),S=d.map((e,i)=>{let a=t.twoBelts?i===0?-1:1:n;return{x:e.cx+a*1.95,z:e.topZ-r-1,bin:{x:e.cx+a*2.75,z:e.topZ-r-1.25},belt:e.id}}),C={x:(v-2)*n,z:y-2.3,desk:{x:(v-.9)*n,z:y-2.3}},w={x:-(v-2)*n,z:y-2.3},T={x:0,z:y},E={x:d[0].cx,z:i+t.len1+r+Af+.95},D=d[1]?{x:d[1].cx,z:x[1].z,model:{x:d[1].cx+.9*(d[1].cx>0?1:-1),z:x[1].z-.3}}:null,ee=e.theme===`mall`?{x:-(v-.55)*n,z:y-1.2}:null;return{m:n,r,topZ:i,kitchenZ:s,dockZ:c,belts:d,stations:p,rack:g,sink:_,feeds:x,trashes:S,upgrade:C,nextPad:w,door:T,extPad:E,lever:D,idle:{runner:{x:d[0].cx+.9*n,z:i-r-2.4},hauler:{x:-f*n,z:s+2.2}},escalator:ee,bounds:{x0:-v,x1:v,z0:b,z1:y},halfW:v,backZ:b,bottomZ:y}}function Nf(e,t,n){let[,r,i]=e.split(`-`),a=.5+Number(i)*1,o=t.r,s=t.topZ+a;if(r===`R`)return{d:a,side:r,x:t.cx+o+jf,z:s,ry:-Math.PI/2,s:a,cx:t.cx+o+.58,cz:s};let c=2*n+2*Math.PI*o;return{d:a,side:r,x:t.cx-o-jf,z:s,ry:Math.PI/2,s:(n+Math.PI*o+(n-a))%c,cx:t.cx-o-.58,cz:s}}var Pf=class{constructor(e,t){this.id=e.id,this.cx=e.cx,this.topZ=e.topZ,this.r=e.r,this.offset=0,this.slots=[],this.built=!1,this.group=null,this.setLen(t)}setLen(e){let t=this.slots.filter(e=>e.item).map(e=>e.item);this.len=e,this.L=2*e+2*Math.PI*this.r;let n=Math.max(6,Math.floor(this.L/X.belt.spacing));this.sp=this.L/n,this.slots=[];for(let e=0;e<n;e++)this.slots.push({i:e,item:null,res:!1,prevS:0});t.forEach((e,r)=>{r<n&&(this.slots[Math.floor(r*n/Math.max(1,t.length))%n].item=e)}),this.feedS=2*e+1.5*Math.PI*this.r;for(let e of this.slots)e.prevS=this.slotS(e)}point(e,t={x:0,z:0,a:0}){let{len:n,r,cx:i,topZ:a}=this;e=(e%this.L+this.L)%this.L;let o=Math.PI*r;if(e<n)t.x=i+r,t.z=a+e,t.a=0;else if(e<n+o){let o=(e-n)/r;t.x=i+r*Math.cos(o),t.z=a+n+r*Math.sin(o),t.a=o}else if(e<2*n+o)t.x=i-r,t.z=a+n-(e-n-o),t.a=Math.PI;else{let s=Math.PI+(e-2*n-o)/r;t.x=i+r*Math.cos(s),t.z=a+r*Math.sin(s),t.a=s}return t}slotS(e){return(this.offset+e.i*this.sp)%this.L}nearestS(e,t){let n=0,r=1e9,i={};for(let a=0;a<this.L;a+=.05){this.point(a,i);let o=(i.x-e)**2+(i.z-t)**2;o<r&&(r=o,n=a)}return n}dist(e,t){let n=Math.abs(e-t)%this.L;return Math.min(n,this.L-n)}slotNear(e,t){for(let n of this.slots)if(this.dist(this.slotS(n),e)<t)return n;return null}count(){let e=0;for(let t of this.slots)(t.item||t.res)&&e++;return e}free(){return this.slots.length-this.count()}seg(){return{x:this.cx,z0:this.topZ,z1:this.topZ+this.len}}update(e,t,n){this.offset=(this.offset+t*e)%this.L;for(let e of this.slots){let t=this.slotS(e);if(e.item){let r=e.prevS,i=this.feedS;(r<=t?r<i&&t>=i:r<i||t>=i)&&n(e)}e.prevS=t}}},Ff=null;function If(){return Ff||(Ff=pd(128,64,(e,t,n)=>{e.fillStyle=`#5b6072`,e.fillRect(0,0,t,n);for(let t=0;t<4;t++){let r=t*32,i=e.createLinearGradient(r,0,r+32,0);i.addColorStop(0,`#8d93a8`),i.addColorStop(.5,`#a9aec0`),i.addColorStop(1,`#7c8296`),e.fillStyle=i,e.fillRect(r+2,4,28,n-8),e.fillStyle=`rgba(255,255,255,0.25)`,e.fillRect(r+3,6,26,3)}},!0),Ff.userData.shared=!0,Ff)}function Lf(e,t,n,r){let i=new Sa,a=[];for(let i=0;i<=20;i++){let o=-Math.PI/2+i/20*Math.PI;a.push([e+Math.cos(o)*r,t+n+Math.sin(o)*r])}a.length=0;for(let i=0;i<=20;i++){let o=i/20*Math.PI;a.push([e+r*Math.cos(o),t+n+r*Math.sin(o)])}for(let n=0;n<=20;n++){let i=Math.PI+n/20*Math.PI;a.push([e+r*Math.cos(i),t+r*Math.sin(i)])}return a.forEach(([e,t],n)=>n===0?i.moveTo(e,-t):i.lineTo(e,-t)),i.closePath(),i}function Rf(e,t,n,r,i,a){let o=Lf(e,t,n,i);if(r>0){let i=Lf(e,t,n,r);o.holes.push(new xa(i.getPoints().reverse()))}let s=new oo(o,{depth:a,bevelEnabled:!1,curveSegments:4});return s.rotateX(-Math.PI/2),s}function zf(e,t){let n=new Rn,{cx:r,topZ:i,len:a,r:o}=e,s=.78,c=new W;c.addGeo(Vf(Rf(r,i,a,o-kf,o+Af,.72),t.counter)),c.addGeo(Vf(Rf(r,i,a,o-kf-.05,o+Af+.06,.07),t.counterTop,.71)),c.addGeo(Vf(Rf(r,i,a,o+.3,o+.36,.06),`#c9ccd6`,s)),c.addGeo(Vf(Rf(r,i,a,o-.36,o-.3,.06),`#c9ccd6`,s));let l=c.mesh(Yu,!0);l.receiveShadow=!0,n.add(l);let u=[],d=[],f=[],p={},m=Math.ceil(e.L/.1);for(let t=0;t<=m;t++){let n=t/m*e.L;e.point(n,p);let r=Bf(e,n),i=.3;if(u.push(p.x+r.x*i,.795,p.z+r.z*i,p.x-r.x*i,.795,p.z-r.z*i),d.push(n/.5,0,n/.5,1),t<m){let e=t*2;f.push(e,e+2,e+1,e+1,e+2,e+3)}}let h=new Vr;if(h.setAttribute(`position`,new kr(u,3)),h.setAttribute(`uv`,new kr(d,2)),h.setIndex(f),h.computeVertexNormals(),h.attributes.normal.getY(0)<0){for(let e=0;e<f.length;e+=3){let t=f[e];f[e]=f[e+2],f[e+2]=t}h.setIndex(f),h.computeVertexNormals()}let g=new di(h,new Eo({map:If()}));return g.receiveShadow=!0,n.add(g),n.userData.ribbon=g,n}function Bf(e,t){let n={},r={};e.point(t-.02,n),e.point(t+.02,r);let i=r.x-n.x,a=r.z-n.z,o=Math.hypot(i,a)||1;return{x:-a/o,z:i/o}}function Vf(e,t,n=0){let r=e.index?e.toNonIndexed():e;for(let e of Object.keys(r.attributes))e!==`position`&&e!==`normal`&&r.deleteAttribute(e);r.translate(0,n,0);let i=r.attributes.position.count,a=new Gn(t),o=new Float32Array(i*3);for(let e=0;e<i;e++)o[e*3]=a.r,o[e*3+1]=a.g,o[e*3+2]=a.b;return r.setAttribute(`color`,new Er(o,3)),r}function Hf(e,t){let n=If();n.offset.x-=t*e/.5}var Uf=.78;function Wf(e,t,n,r,i,a){e.beginPath(),e.moveTo(t+a,n),e.arcTo(t+r,n,t+r,n+i,a),e.arcTo(t+r,n+i,t,n+i,a),e.arcTo(t,n+i,t,n,a),e.arcTo(t,n,t+r,n,a),e.closePath()}function Gf(e,t=3){e.lineWidth=t,e.strokeStyle=`rgba(40,24,20,0.85)`,e.stroke()}function Kf(e,t,n,r,i){if(e.fillStyle=`#fbf8f0`,Wf(e,t*.2,t*.48,t*.6,t*.26,t*.12),e.fill(),Gf(e,t*.04),e.fillStyle=n,e.beginPath(),e.moveTo(t*.12,t*.52),e.quadraticCurveTo(t*.5,t*.2,t*.88,t*.46),e.quadraticCurveTo(t*.9,t*.6,t*.8,t*.6),e.quadraticCurveTo(t*.5,t*.46,t*.18,t*.64),e.quadraticCurveTo(t*.08,t*.6,t*.12,t*.52),e.fill(),Gf(e,t*.04),r){e.strokeStyle=r,e.lineWidth=t*.035;for(let n=0;n<3;n++){e.beginPath();let r=t*(.32+n*.16);e.moveTo(r,t*.36),e.lineTo(r+t*.06,t*.54),e.stroke()}}i&&i(e,t)}function qf(e,t,n,r){if(e.fillStyle=`#1d2b22`,Wf(e,t*.2,t*.4,t*.6,t*.36,t*.08),e.fill(),Gf(e,t*.04),e.fillStyle=`#2f4a38`,e.fillRect(t*.24,t*.5,t*.52,t*.04),e.fillStyle=n,e.beginPath(),e.ellipse(t*.5,t*.4,t*.3,t*.12,0,0,Math.PI*2),e.fill(),Gf(e,t*.035),r){e.fillStyle=r;for(let n=0;n<7;n++)e.beginPath(),e.arc(t*(.3+n%4*.13+(n>3?.06:0)),t*(.36+(n>3?.07:0)),t*.05,0,Math.PI*2),e.fill();e.fillStyle=`rgba(255,255,255,0.7)`;for(let n=0;n<4;n++)e.beginPath(),e.arc(t*(.29+n*.13),t*.345,t*.015,0,Math.PI*2),e.fill()}else e.fillStyle=`rgba(255,255,255,0.35)`,e.beginPath(),e.ellipse(t*.42,t*.37,t*.12,t*.04,0,0,Math.PI*2),e.fill()}function Jf(e,t,n){switch(t){case`salmon`:Kf(e,n,`#ff8a4c`,`#ffe1cc`);break;case`tuna`:Kf(e,n,`#d4263f`,null,e=>{e.fillStyle=`rgba(255,255,255,0.3)`,e.beginPath(),e.ellipse(n*.45,n*.42,n*.18,n*.04,-.2,0,Math.PI*2),e.fill()});break;case`tamago`:e.fillStyle=`#fbf8f0`,Wf(e,n*.2,n*.52,n*.6,n*.22,n*.1),e.fill(),Gf(e,n*.04),e.fillStyle=`#ffd23f`,Wf(e,n*.14,n*.28,n*.72,n*.3,n*.06),e.fill(),Gf(e,n*.04),e.fillStyle=`#1d2b22`,e.fillRect(n*.44,n*.27,n*.12,n*.47);break;case`ebi`:e.fillStyle=`#fbf8f0`,Wf(e,n*.22,n*.56,n*.56,n*.2,n*.1),e.fill(),Gf(e,n*.04),e.fillStyle=`#e9a53c`,e.beginPath(),e.ellipse(n*.46,n*.46,n*.3,n*.13,-.35,0,Math.PI*2),e.fill(),Gf(e,n*.04),e.fillStyle=`#f7c86a`;for(let t=0;t<5;t++)e.beginPath(),e.arc(n*(.28+t*.08),n*(.5-t*.03),n*.03,0,Math.PI*2),e.fill();e.fillStyle=`#ff4a3a`,e.beginPath(),e.moveTo(n*.7,n*.32),e.lineTo(n*.9,n*.18),e.lineTo(n*.86,n*.36),e.closePath(),e.fill(),Gf(e,n*.03);break;case`udon`:e.fillStyle=`#b8392e`,e.beginPath(),e.moveTo(n*.12,n*.44),e.lineTo(n*.88,n*.44),e.quadraticCurveTo(n*.84,n*.82,n*.5,n*.82),e.quadraticCurveTo(n*.16,n*.82,n*.12,n*.44),e.fill(),Gf(e,n*.04),e.fillStyle=`#f6e7bf`,e.beginPath(),e.ellipse(n*.5,n*.44,n*.38,n*.1,0,0,Math.PI*2),e.fill(),Gf(e,n*.035),e.strokeStyle=`#e0c98a`,e.lineWidth=n*.02;for(let t=0;t<4;t++)e.beginPath(),e.arc(n*(.34+t*.1),n*.44,n*.05,0,Math.PI),e.stroke();e.fillStyle=`#fff`,e.beginPath(),e.arc(n*.62,n*.42,n*.06,0,Math.PI*2),e.fill(),e.strokeStyle=`#ff7ab8`,e.lineWidth=n*.02,e.beginPath(),e.arc(n*.62,n*.42,n*.03,0,Math.PI*1.6),e.stroke(),e.fillStyle=`#5fbf4a`,e.fillRect(n*.34,n*.4,n*.05,n*.03),e.fillRect(n*.44,n*.46,n*.05,n*.03),e.strokeStyle=`#6b4a2a`,e.lineWidth=n*.03,e.beginPath(),e.moveTo(n*.62,n*.12),e.lineTo(n*.52,n*.44),e.moveTo(n*.74,n*.14),e.lineTo(n*.58,n*.44),e.stroke();break;case`uni`:qf(e,n,`#ffb52e`),e.fillStyle=`#ffcf5a`;for(let t=0;t<4;t++)e.beginPath(),e.ellipse(n*(.32+t*.12),n*.37,n*.06,n*.035,.4,0,Math.PI*2),e.fill();break;case`ikura`:qf(e,n,`#ff6a1f`,`#ff4a10`);break;case`unagi`:Kf(e,n,`#8a5530`,null,e=>{e.strokeStyle=`#4a2a14`,e.lineWidth=n*.04;for(let t=0;t<3;t++)e.beginPath(),e.moveTo(n*(.28+t*.18),n*.4),e.lineTo(n*(.3+t*.18),n*.56),e.stroke();e.fillStyle=`#1d2b22`,e.fillRect(n*.46,n*.34,n*.08,n*.4)});break;case`dessert`:e.strokeStyle=`#c99a5a`,e.lineWidth=n*.04,e.beginPath(),e.moveTo(n*.12,n*.82),e.lineTo(n*.86,n*.14),e.stroke(),[[`#8fd16a`,.34,.62],[`#ffffff`,.5,.47],[`#ff9cc4`,.66,.32]].forEach(([t,r,i])=>{e.fillStyle=t,e.beginPath(),e.arc(n*r,n*i,n*.13,0,Math.PI*2),e.fill(),Gf(e,n*.035)});break;case`star`:e.fillStyle=`#b58cff`,e.beginPath();for(let t=0;t<10;t++){let r=-Math.PI/2+t*Math.PI/5,i=t%2?n*.17:n*.38;e.lineTo(n*.5+Math.cos(r)*i,n*.52+Math.sin(r)*i)}e.closePath(),e.fill(),Gf(e,n*.04),e.fillStyle=`rgba(255,255,255,0.6)`,e.beginPath(),e.arc(n*.43,n*.44,n*.06,0,Math.PI*2),e.fill();break;default:e.fillStyle=`#ccc`,e.fillRect(n*.2,n*.2,n*.6,n*.6)}}function Yf(e,t,n){let r=lf[t]?.color||`#ccc`;switch(e.save(),t){case`salmon`:case`tuna`:case`eel`:e.fillStyle=r,Wf(e,n*.14,n*.3,n*.72,n*.4,n*.1),e.fill(),Gf(e,n*.04),e.strokeStyle=t===`salmon`?`#ffe1cc`:`rgba(255,255,255,0.3)`,e.lineWidth=n*.035;for(let t=0;t<3;t++)e.beginPath(),e.moveTo(n*(.3+t*.16),n*.32),e.lineTo(n*(.38+t*.16),n*.68),e.stroke();break;case`egg`:for(let t=0;t<3;t++)e.fillStyle=`#fff6df`,e.beginPath(),e.ellipse(n*(.28+t*.22),n*.5,n*.1,n*.14,0,0,Math.PI*2),e.fill(),Gf(e,n*.035);break;case`shrimp`:e.strokeStyle=r,e.lineWidth=n*.16,e.lineCap=`round`,e.beginPath(),e.arc(n*.5,n*.5,n*.22,Math.PI*.2,Math.PI*1.5),e.stroke(),e.fillStyle=`#ff4a3a`,e.beginPath(),e.moveTo(n*.5,n*.22),e.lineTo(n*.72,n*.14),e.lineTo(n*.66,n*.34),e.fill();break;case`noodle`:e.fillStyle=r,Wf(e,n*.14,n*.38,n*.72,n*.26,n*.1),e.fill(),Gf(e,n*.04),e.fillStyle=`#c0392b`,e.fillRect(n*.44,n*.36,n*.1,n*.3);break;case`uni`:e.fillStyle=`#3a2a4a`,e.beginPath(),e.arc(n*.5,n*.52,n*.24,0,Math.PI*2),e.fill(),e.strokeStyle=`#3a2a4a`,e.lineWidth=n*.03;for(let t=0;t<14;t++){let r=t/14*Math.PI*2;e.beginPath(),e.moveTo(n*.5+Math.cos(r)*n*.2,n*.52+Math.sin(r)*n*.2),e.lineTo(n*.5+Math.cos(r)*n*.36,n*.52+Math.sin(r)*n*.36),e.stroke()}e.fillStyle=r,e.beginPath(),e.arc(n*.5,n*.5,n*.1,0,Math.PI*2),e.fill();break;case`berry`:e.fillStyle=r,e.beginPath(),e.moveTo(n*.26,n*.36),e.quadraticCurveTo(n*.5,n*.28,n*.74,n*.36),e.quadraticCurveTo(n*.7,n*.7,n*.5,n*.84),e.quadraticCurveTo(n*.3,n*.7,n*.26,n*.36),e.fill(),Gf(e,n*.035),e.fillStyle=`#4fbf4a`,e.beginPath(),e.ellipse(n*.5,n*.3,n*.2,n*.07,0,0,Math.PI*2),e.fill();break;case`roe`:e.fillStyle=`rgba(255,255,255,0.8)`,Wf(e,n*.28,n*.24,n*.44,n*.56,n*.08),e.fill(),Gf(e,n*.035),e.fillStyle=r;for(let t=0;t<9;t++)e.beginPath(),e.arc(n*(.37+t%3*.13),n*(.46+Math.floor(t/3)*.1),n*.05,0,Math.PI*2),e.fill();break;case`star`:Jf(e,`star`,n)}e.restore()}var Xf=new Map;function Zf(e,t,n=96){let r=e+`:`+t+`:`+n;if(Xf.has(r))return Xf.get(r);let i=document.createElement(`canvas`);i.width=n,i.height=n;let a=i.getContext(`2d`);a.lineJoin=`round`,e===`menu`?Jf(a,t,n):Yf(a,t,n);let o=i.toDataURL();return Xf.set(r,o),o}function Qf(e,t=`mi`){return`<img class="${t}" src="${Zf(`menu`,e)}" alt="${sf[e]?.name||``}" draggable="false">`}var Z={coin:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffc83d" stroke="#b9770e" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="#e8a21a" stroke-width="1.6"/><path d="M12 8v8" stroke="#b9770e" stroke-width="2" stroke-linecap="round"/></svg>`,pearl:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#f4eefc" stroke="#9a86c9" stroke-width="2"/><circle cx="9" cy="9" r="3" fill="#fff"/><circle cx="14" cy="15" r="4" fill="#dcd0f2" opacity=".6"/></svg>`,star:`<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.8z" fill="#ffc83d" stroke="#b9770e" stroke-width="1.6" stroke-linejoin="round"/></svg>`,heart:`<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="#ff4f6d" stroke="#a3213a" stroke-width="1.6"/></svg>`,angry:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ff5a3c" stroke="#8a1e10" stroke-width="1.6"/><path d="M7 9l3 1.5M17 9l-3 1.5" stroke="#3a0a04" stroke-width="2" stroke-linecap="round"/><path d="M8 17q4-3 8 0" stroke="#3a0a04" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,happy:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffd23f" stroke="#a37a00" stroke-width="1.6"/><path d="M7.5 10q1.5-2 3 0M13.5 10q1.5-2 3 0" stroke="#3a2a00" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M7 14q5 5 10 0z" fill="#8a2a1a"/></svg>`,sweat:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffd23f" stroke="#a37a00" stroke-width="1.6"/><path d="M8 11h3M13 11h3" stroke="#3a2a00" stroke-width="1.8" stroke-linecap="round"/><path d="M9 16h6" stroke="#3a2a00" stroke-width="1.8" stroke-linecap="round"/><path d="M19 4q2 3 0 5q-2-2 0-5z" fill="#5ac8ff"/></svg>`,crown:`<svg viewBox="0 0 24 24"><path d="M3 18l1.5-10 5 4.5L12 5l2.5 7.5 5-4.5L21 18z" fill="#ffc83d" stroke="#b9770e" stroke-width="1.6" stroke-linejoin="round"/></svg>`,pause:`<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor"/></svg>`,sound:`<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8q3 4 0 8M18.5 5.5q5 6.5 0 13" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,mute:`<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,mission:`<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2.5" fill="#fff4dc" stroke="#7a4a1a" stroke-width="1.8"/><path d="M8 9l2 2 4-4M8 15h8" stroke="#e8483b" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,calendar:`<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="#fff" stroke="#7a4a1a" stroke-width="1.8"/><rect x="3" y="5" width="18" height="5" rx="2" fill="#e8483b"/><circle cx="12" cy="15" r="3" fill="#ffc83d"/></svg>`,book:`<svg viewBox="0 0 24 24"><path d="M4 5q4-2 8 1v14q-4-3-8-1z" fill="#ffe2b8" stroke="#7a4a1a" stroke-width="1.6"/><path d="M20 5q-4-2-8 1v14q4-3 8-1z" fill="#fff4dc" stroke="#7a4a1a" stroke-width="1.6"/></svg>`,shirt:`<svg viewBox="0 0 24 24"><path d="M8 3l-5 4 3 3 2-1v12h8V9l2 1 3-3-5-4q-2 2-4 2t-4-2z" fill="#4fb0ff" stroke="#1a4a7a" stroke-width="1.6" stroke-linejoin="round"/></svg>`,trophy:`<svg viewBox="0 0 24 24"><path d="M7 3h10v5a5 5 0 0 1-10 0z" fill="#ffc83d" stroke="#b9770e" stroke-width="1.6"/><path d="M7 5H4q0 4 3.5 4.5M17 5h3q0 4-3.5 4.5" stroke="#b9770e" stroke-width="1.6" fill="none"/><path d="M10 13h4v4h3v3H7v-3h3z" fill="#e8a21a" stroke="#b9770e" stroke-width="1.4"/></svg>`,chart:`<svg viewBox="0 0 24 24"><rect x="4" y="12" width="4" height="8" rx="1" fill="#4fb0ff"/><rect x="10" y="7" width="4" height="13" rx="1" fill="#ffc83d"/><rect x="16" y="3" width="4" height="17" rx="1" fill="#e8483b"/></svg>`,gear:`<svg viewBox="0 0 24 24"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm8.5 5l-2 .4-.6 1.5 1.2 1.7-1.8 1.8-1.7-1.2-1.5.6-.4 2h-2.6l-.4-2-1.5-.6-1.7 1.2-1.8-1.8 1.2-1.7-.6-1.5-2-.4v-2.6l2-.4.6-1.5-1.2-1.7 1.8-1.8 1.7 1.2 1.5-.6.4-2h2.6l.4 2 1.5.6 1.7-1.2 1.8 1.8-1.2 1.7.6 1.5 2 .4z" fill="currentColor"/></svg>`,arrow:`<svg viewBox="0 0 24 24"><path d="M12 2l8 10h-5v10H9V12H4z" fill="#ffe14d" stroke="#8a5a00" stroke-width="1.6" stroke-linejoin="round"/></svg>`,hand:`<svg viewBox="0 0 48 48"><path d="M18 6a3 3 0 0 1 6 0v16l2-.5V14a3 3 0 0 1 6 0v9l2 .3V17a3 3 0 0 1 6 0v14q0 11-10 13h-5q-6 0-10-6l-7-10a3 3 0 0 1 4.5-4L18 29z" fill="#fff" stroke="#333" stroke-width="2.2" stroke-linejoin="round"/></svg>`,menu:`<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="2.6" rx="1.3" fill="currentColor"/><rect x="4" y="11" width="16" height="2.6" rx="1.3" fill="currentColor"/><rect x="4" y="16" width="16" height="2.6" rx="1.3" fill="currentColor"/></svg>`,up2:`<svg viewBox="0 0 24 24"><path d="M12 3l7 7h-4v5H9v-5H5z" fill="#35c46a" stroke="#167a3a" stroke-width="1.6" stroke-linejoin="round"/><rect x="6" y="17" width="12" height="3.5" rx="1.5" fill="#ffc83d" stroke="#b9770e" stroke-width="1.4"/></svg>`,lock:`<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2.5" fill="#8a8f9e"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#8a8f9e" stroke-width="2.4" fill="none"/></svg>`,up:`<svg viewBox="0 0 24 24"><path d="M12 4l7 8h-4v8H9v-8H5z" fill="#fff"/></svg>`,plate:`<svg viewBox="0 0 24 24"><ellipse cx="12" cy="13" rx="9" ry="5" fill="#fff" stroke="#667" stroke-width="1.6"/><ellipse cx="12" cy="12.5" rx="5" ry="2.5" fill="#e8eef5"/></svg>`,belt:`<svg viewBox="0 0 24 24"><rect x="2" y="8" width="20" height="8" rx="4" fill="#556" /><circle cx="6" cy="12" r="2" fill="#ccd"/><circle cx="18" cy="12" r="2" fill="#ccd"/><rect x="8" y="5" width="8" height="4" rx="1" fill="#ff9a3c"/></svg>`,fire:`<svg viewBox="0 0 24 24"><path d="M12 2q5 5 5 11a5 5 0 0 1-10 0q0-3 2-5 0 3 2 3 0-5 1-9z" fill="#ff7a2a" stroke="#a3350a" stroke-width="1.4"/></svg>`,run:`<svg viewBox="0 0 24 24"><circle cx="15" cy="4.5" r="2.5" fill="#fff"/><path d="M9 21l3-6 3 2v4M7 12l3-4h4l2 4 3 1M12 8l-2 5 4 3" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,stack:`<svg viewBox="0 0 24 24"><rect x="5" y="15" width="14" height="4" rx="1.5" fill="#fff"/><rect x="6" y="10" width="12" height="4" rx="1.5" fill="#fff" opacity=".85"/><rect x="7" y="5" width="10" height="4" rx="1.5" fill="#fff" opacity=".7"/></svg>`},$f={ing:.2,dish:.2,dirty:.075,clean:.075,cash:.08};function ep(){let e=new W;return e.add(G.cyl(.29,.2,.05,18),`#ffffff`,0,.025,0),e.add(G.cyl(.2,.2,.012,18),`#e6e6e6`,0,.053,0),e.add(G.torus(.26,.018,5,22),`#ffffff`,0,.05,0,Math.PI/2),e.geometry()}function tp(e,t,n,r=.055){for(let i of[-.09,.09])if(e.add(G.sph(.1,10,7),`#fbf8f0`,i,r+.045,0,0,0,0,.72,.6,1.25),e.add(G.rbox(.15,.04,.3,.05),t,i,r+.1,0,.1,0,0),n)for(let t of[-.07,0,.07])e.add(G.box(.152,.012,.018),n,i,r+.123,t+.01,.1,0,.4)}function np(e){let t=new W;switch(e){case`salmon`:tp(t,`#ff8a4c`,`#ffe1cc`);break;case`tuna`:tp(t,`#d4263f`,null);break;case`unagi`:tp(t,`#8a5530`,`#4a2a14`);for(let e of[-.09,.09])t.add(G.box(.16,.02,.05),`#1d2b22`,e,.155,0);break;case`tamago`:for(let e of[-.09,.09])t.add(G.sph(.1,10,7),`#fbf8f0`,e,.095,0,0,0,0,.7,.55,1.2),t.add(G.rbox(.15,.08,.28,.03),`#ffd23f`,e,.165,0),t.add(G.box(.16,.1,.06),`#1d2b22`,e,.155,0);break;case`ebi`:for(let e of[-.08,.08])t.add(G.cap(.06,.2,6),`#e9a53c`,e,.135,0,Math.PI/2,0,0),t.add(G.cone(.05,.09,6),`#ff4a3a`,e,.155,-.2,-Math.PI/2,0,0);t.add(G.box(.12,.04,.08),`#6fcf5a`,0,.08499999999999999,.14);break;case`udon`:t.add(G.cyl(.24,.15,.17,16),`#b8392e`,0,.14,0),t.add(G.cyl(.21,.21,.02,16),`#f6e7bf`,0,.215,0),t.add(G.cyl(.05,.05,.025,10),`#ffffff`,.07,.22999999999999998,.03),t.add(G.cyl(.025,.025,.028,8),`#ff7ab8`,.07,.23099999999999998,.03),t.add(G.box(.04,.02,.04),`#5fbf4a`,-.07,.22999999999999998,-.02),t.add(G.box(.04,.02,.04),`#5fbf4a`,-.03,.22999999999999998,.07),t.add(G.cyl(.012,.012,.4,5),`#8a5a2a`,-.02,.315,-.05,.9,0,.3);break;case`uni`:case`ikura`:for(let n of[-.09,.09])if(t.add(G.cyl(.085,.085,.12,10),`#1d2b22`,n,.11499999999999999,0),t.add(G.cyl(.075,.075,.02,10),e===`uni`?`#ffb52e`:`#ff6a1f`,n,.18,0),e===`uni`)t.add(G.sph(.05,8,6),`#ffc84a`,n,.195,0,0,0,0,1.2,.5,.8);else for(let e=0;e<4;e++)t.add(G.sph(.025,6,5),`#ff4a10`,n+Math.cos(e*1.6)*.035,.195,Math.sin(e*1.6)*.035);break;case`dessert`:t.add(G.cyl(.01,.01,.46,5),`#c99a5a`,0,.125,0,Math.PI/2,.5,0),[[`#8fd16a`,-.13],[`#ffffff`,0],[`#ff9cc4`,.13]].forEach(([e,n])=>{t.add(G.sph(.075,10,8),e,Math.sin(.5)*n,.13,Math.cos(.5)*n)});break;case`star`:{let e=new Sa;for(let t=0;t<10;t++){let n=-Math.PI/2+t*Math.PI/5,r=t%2?.09:.2;t===0?e.moveTo(Math.cos(n)*r,Math.sin(n)*r):e.lineTo(Math.cos(n)*r,Math.sin(n)*r)}let n=new oo(e,{depth:.1,bevelEnabled:!0,bevelSize:.02,bevelThickness:.02,bevelSegments:1});n.rotateX(-Math.PI/2),t.add(n,`#b58cff`,0,.075,0),t.add(G.sph(.04,6,5),`#ffffff`,-.04,.205,-.03);break}}return t.geometry()}function rp(e){let t=new W,n=lf[e].color;switch(e){case`salmon`:t.add(G.rbox(.46,.14,.28,.06),n,0,.07,0);for(let e of[-.12,0,.12])t.add(G.box(.03,.142,.26),`#ffe1cc`,e,.07,0,0,.4,0);break;case`tuna`:t.add(G.rbox(.44,.17,.3,.05),n,0,.085,0),t.add(G.box(.3,.172,.04),`#e85a6a`,0,.085,.05,0,.3,0);break;case`eel`:t.add(G.rbox(.52,.1,.2,.08),n,0,.05,0),t.add(G.box(.5,.02,.06),`#4a2a14`,0,.1,0);break;case`egg`:t.add(G.rbox(.44,.08,.3,.04),`#d9c39a`,0,.04,0);for(let e=0;e<4;e++)t.add(G.sph(.07,8,6),`#fff6df`,-.15+e*.1,.12,0,0,0,0,.9,1.2,.9);break;case`shrimp`:t.add(G.torus(.12,.06,6,10,Math.PI*1.4),n,0,.07,0,Math.PI/2,0,0),t.add(G.cone(.06,.1,6),`#ff4a3a`,.12,.07,-.08);break;case`noodle`:t.add(G.cyl(.12,.12,.44,10),n,0,.12,0,0,0,Math.PI/2),t.add(G.cyl(.125,.125,.08,10),`#c0392b`,0,.12,0,0,0,Math.PI/2);break;case`uni`:t.add(new lo(.14,0),`#3a2a4a`,0,.13,0),t.add(new lo(.17,0),`#4a3a5a`,0,.13,0,.5,.5,0,.7,1.1,.7),t.add(G.cyl(.07,.07,.02,8),n,0,.26,0);break;case`berry`:t.add(G.rbox(.42,.08,.3,.04),`#e9d9b0`,0,.04,0);for(let e of[-.1,.1])t.add(G.cone(.08,.14,8),n,e,.15,0,Math.PI,0,0),t.add(G.cyl(.06,.06,.02,6),`#4fbf4a`,e,.22,0);break;case`roe`:t.add(G.cyl(.12,.12,.2,12),`#f3e4dc`,0,.1,0),t.add(G.cyl(.11,.11,.14,12),n,0,.1,0),t.add(G.cyl(.13,.13,.04,12),`#e8483b`,0,.21,0);break;case`star`:t.add(new uo(.15,0),n,0,.15,0),t.add(new uo(.08,0),`#ffffff`,0,.15,0,.6,.6,0)}return t.geometry()}function ip(){let e=new W;return e.add(G.rbox(.4,.07,.22,.02),`#46b86a`,0,.035,0),e.add(G.box(.1,.072,.225),`#8fe0a8`,0,.035,0),e.add(G.cyl(.035,.035,.074,8),`#2f8a4c`,0,.035,0),e.geometry()}function ap(){let e=new W;return e.add(G.cyl(.13,.13,.04,14),`#ffc83d`,0,0,0,Math.PI/2,0,0),e.add(G.cyl(.08,.08,.045,10),`#ffe07a`,0,0,0,Math.PI/2,0,0),e.geometry()}function op(){return{body:new W().add(G.cap(.2,.22,10),`#ffffff`,0,.36,0).geometry(),head:new W().add(G.sph(.2,14,10),`#ffd9b8`,0,0,0).geometry(),hair:new W().add(new mo(.215,14,8,0,Math.PI*2,0,Math.PI*.55),`#ffffff`,0,.01,-.01).geometry(),face:new W().add(G.sph(.028,6,5),`#222222`,-.075,.02,.18).add(G.sph(.028,6,5),`#222222`,.075,.02,.18).add(G.sph(.035,6,5),`#ff9a9a`,-.12,-.05,.15,0,0,0,1,.6,.5).add(G.sph(.035,6,5),`#ff9a9a`,.12,-.05,.15,0,0,0,1,.6,.5).geometry(),crown:new W().add(G.cyl(.13,.12,.08,10),`#ffc83d`,0,0,0).add(G.cone(.035,.08,5),`#ffc83d`,.1,.07,0).add(G.cone(.035,.08,5),`#ffc83d`,-.1,.07,0).add(G.cone(.035,.08,5),`#ffc83d`,0,.07,.1).add(G.cone(.035,.08,5),`#ffc83d`,0,.07,-.1).add(G.sph(.03,6,5),`#e2394f`,0,.03,.125).geometry(),legs:new W().add(G.cap(.07,.12,6),`#ffffff`,-.09,.1,0).add(G.cap(.07,.12,6),`#ffffff`,.09,.1,0).geometry()}}function sp(e={}){let t=new Rn,n=`#ffd9b8`,r=e.body||`#ffffff`,i=new Rn;t.add(i);let a=(e,t=!0)=>e.mesh(Yu,t),o=a(new W().add(G.cap(.075,.14,6),e.pants||`#3a3f55`,0,-.1,0)),s=a(new W().add(G.cap(.075,.14,6),e.pants||`#3a3f55`,0,-.1,0));o.position.set(-.1,.24,0),s.position.set(.1,.24,0),i.add(o,s);let c=a(new W().add(G.cap(.24,.26,12),r,0,0,0).add(G.sph(.035,6,5),`#d0d4e0`,0,.12,.235).add(G.sph(.035,6,5),`#d0d4e0`,0,0,.24));c.position.set(0,.56,0),i.add(c);let l=new Eo({color:e.apron||`#ffffff`}),u=new di(new Ui(.248,.26,.3,14,1,!0,-Math.PI*.42,Math.PI*.84),l);u.position.set(0,.48,.005),u.castShadow=!0,i.add(u);let d=new Rn;d.position.set(0,.98,0),i.add(d);let f=a(new W().add(G.sph(.25,16,12),n,0,0,0).add(G.sph(.034,6,5),`#222222`,-.085,.02,.225).add(G.sph(.034,6,5),`#222222`,.085,.02,.225).add(G.sph(.045,6,5),`#ff9a9a`,-.14,-.06,.19,0,0,0,1,.6,.5).add(G.sph(.045,6,5),`#ff9a9a`,.14,-.06,.19,0,0,0,1,.6,.5).add(G.box(.06,.018,.02),`#7a3a2a`,0,-.07,.24).add(new mo(.262,14,8,0,Math.PI*2,0,Math.PI*.42),e.hair||`#3a2a22`,0,.02,-.02));d.add(f);let p={};p.chef=a(new W().add(G.cyl(.2,.2,.16,14),`#ffffff`,0,.26,0).add(G.sph(.16,10,8),`#ffffff`,-.08,.38,0).add(G.sph(.16,10,8),`#ffffff`,.08,.38,0).add(G.sph(.16,10,8),`#ffffff`,0,.4,.06)),p.band=a(new W().add(G.torus(.245,.04,6,18),`#ffffff`,0,.1,0,Math.PI/2-.1).add(G.sph(.05,6,5),`#e2394f`,0,.12,.25).add(G.box(.05,.14,.02),`#ffffff`,.05,.06,-.26,.3,0,.3)),p.cat=a(new W().add(G.cone(.09,.16,4),`#ff9a3c`,-.14,.24,0,0,.8,-.3).add(G.cone(.09,.16,4),`#ff9a3c`,.14,.24,0,0,.8,.3).add(G.cone(.05,.08,4),`#ffc2d8`,-.14,.23,.03,0,.8,-.3).add(G.cone(.05,.08,4),`#ffc2d8`,.14,.23,.03,0,.8,.3)),p.pirate=a(new W().add(G.cyl(.3,.32,.05,16),`#2a2a2e`,0,.16,0).add(G.cyl(.2,.24,.18,14),`#2a2a2e`,0,.26,0).add(G.box(.08,.08,.02),`#ffffff`,0,.28,.225).add(G.torus(.22,.02,5,16),`#ffc83d`,0,.2,0,Math.PI/2)),p.crown=a(new W().add(G.cyl(.19,.17,.12,12),`#ffc83d`,0,.26,0).add(G.cone(.05,.12,5),`#ffc83d`,.14,.37,0).add(G.cone(.05,.12,5),`#ffc83d`,-.14,.37,0).add(G.cone(.05,.12,5),`#ffc83d`,0,.37,.14).add(G.cone(.05,.12,5),`#ffc83d`,0,.37,-.14).add(G.sph(.04,6,5),`#e2394f`,0,.27,.18));let m=new di(new mo(.34,16,12),new Eo({color:12577023,transparent:!0,opacity:.35,depthWrite:!1}));m.position.y=.02,p.helmet=new Rn,p.helmet.add(m,a(new W().add(G.torus(.3,.04,6,18),`#e8ecf5`,0,-.2,0,Math.PI/2).add(G.cyl(.015,.015,.2,5),`#aab`,.2,.3,0).add(G.sph(.035,6,5),`#ff3fa4`,.2,.41,0))),p.cap=a(new W().add(new mo(.265,14,8,0,Math.PI*2,0,Math.PI*.45),e.cap||`#e8483b`,0,.04,0).add(G.cyl(.16,.16,.025,12,1),e.cap||`#e8483b`,0,.1,.2,.2,0,0,1,1,.8));for(let[e,t]of Object.entries(p))t.visible=!1,d.add(t);let h=new W().add(G.cap(.065,.24,6),r,0,-.14,0).add(G.sph(.07,8,6),n,0,-.32,0),g=new Rn,_=new Rn,v=a(h),y=v.clone();return g.add(v),_.add(y),g.position.set(-.27,.72,0),_.position.set(.27,.72,0),i.add(g,_),t.userData={root:i,body:c,head:d,legL:o,legR:s,armL:g,armR:_,apron:u,apronMat:l,hats:p},cp(t,e.hat||`chef`),t}function cp(e,t){let{hats:n}=e.userData;for(let[e,r]of Object.entries(n))r.visible=e===t}function lp(e,t,n,r,i=1){let a=e.userData,o=n?t*11*i:0,s=n?Math.sin(o):0;a.root.position.y=n?Math.abs(Math.sin(o))*.07:Math.sin(t*2.4)*.012,a.root.rotation.z=n?Math.sin(o)*.05:0,a.body.scale.set(1,n?1-Math.abs(Math.cos(o))*.04:1+Math.sin(t*2.4)*.015,1),a.legL.rotation.x=s*.7,a.legR.rotation.x=-s*.7,r?(a.armL.rotation.set(-1.35,0,.1),a.armR.rotation.set(-1.35,0,-.1)):(a.armL.rotation.set(-s*.6,0,.15),a.armR.rotation.set(s*.6,0,-.15)),a.head.rotation.x=n?.06:0}function up(e,t){let n=new W,r=1.6,i=sf[e].plate;return n.add(G.rbox(r,.86,1.1,.12),`#d8dde6`,0,.43,0),n.add(G.rbox(1.6800000000000002,.08,1.18,.14),`#f4f6fa`,0,.9,0),n.add(G.box(1.5,.3,.02),i,0,.5,.56),n.add(G.box(1.3,.05,.03),`#ffffff`,0,.62,.57),n.add(G.rbox(.66,.06,.7,.05),`#e8c48a`,-.42,.97,0),n.add(G.rbox(.66,.04,.7,.05),`#4a4f5f`,.42,.96,0),n.add(G.box(r,.9,.12),t.wall,0,1.35,-.5),n.add(G.rbox(.9,.36,.08,.06),`#ffffff`,0,1.5,-.42),n.add(G.cyl(.16,.16,.02,14),i,0,1.5,-.37,Math.PI/2),n.add(G.box(.3,.02,.06),`#c9ccd6`,-.42,1.01,.2,0,.5,0),n.add(G.box(.12,.03,.04),`#5a3a2a`,-.59,1.01,.32,0,.5,0),n.mesh()}function dp(e,t){let n=new W;n.add(G.box(1.2,.5,.95),`#b07a45`,0,.25,0);for(let e of[.12,.38])n.add(G.box(1.22,.07,.97),`#8a5a2e`,0,e,0);return n.add(G.box(1,.04,.75),`#dff3ff`,0,.5,0),n.add(G.rbox(.44,.3,.06,.04),`#ffffff`,0,.35,.49),n.mesh()}function fp(){let e=new W;return e.add(G.rbox(1.2,.8,.9,.08),`#8a5a3a`,0,.4,0),e.add(G.box(1.24,.06,.94),`#6a4028`,0,.82,0),e.add(G.box(1.1,.03,.8),`#f4f6fa`,0,.86,0),e.mesh()}function pp(e){let t=new W;return t.add(G.rbox(1.6,.86,1.1,.1),`#b9c2cf`,0,.43,0),t.add(G.rbox(1.68,.06,1.16,.12),`#e9eef5`,0,.89,0),t.add(G.rbox(.9,.04,.7,.12),`#5ab4e6`,.2,.9,0),t.add(G.cyl(.03,.03,.4,6),`#c9ccd6`,.2,1.12,-.42),t.add(G.cyl(.03,.03,.3,6),`#c9ccd6`,.2,1.3,-.3,Math.PI/2),t.add(G.sph(.07,8,6),`#ffe14d`,-.52,.99,.2),t.add(G.box(1.6,.6,.1),e.wallTrim,0,1.25,-.52),t.mesh()}function mp(){let e=new W;return e.add(G.cyl(.36,.3,.8,14),`#5f7a8a`,0,.4,0),e.add(G.cyl(.39,.39,.06,14),`#3f5a6a`,0,.82,0),e.add(G.box(.3,.3,.02),`#ffffff`,0,.45,.33),e.add(G.box(.2,.04,.03),`#5f7a8a`,0,.45,.345),e.mesh()}function hp(e){let t=new W;t.add(G.rbox(1.2,.8,1.6,.1),`#6a4a8a`,0,.4,0),t.add(G.rbox(1.3,.06,1.7,.1),`#8f6ab8`,0,.82,0),t.add(G.box(.08,1.3,1.4),`#ffffff`,.5,1.4,0),t.add(G.box(.1,.18,1.2),`#ffc83d`,.44,1.9,0);for(let e=0;e<3;e++)t.add(G.box(.02,.1+e*.12,.12),[`#4fb0ff`,`#ffc83d`,`#e8483b`][e],.45,1.05+(.1+e*.12)/2,-.3+e*.25);return t.add(G.cone(.12,.2,4),`#e8483b`,.45,1.62,.45),t.mesh()}function gp(){let e=new W;return e.add(G.rbox(.5,.3,.5,.08),`#5a5f70`,0,.15,0),e.add(G.cyl(.04,.04,.7,6),`#c9ccd6`,.1,.55,0,0,0,-.4),e.add(G.sph(.1,10,8),`#e8483b`,.24,.87,0),e.mesh()}function _p(e,t,n,r,i,a=1){e.add(G.sph(.26*a,9,7),i,t,n,r,0,0,0,1,1.25,1)}function vp(){let e=new W;return e.add(G.cone(.32,.5,4),`#ffe14d`,0,0,0,Math.PI,Math.PI/4,0),e.add(G.box(.22,.4,.22),`#ffe14d`,0,.4,0,0,Math.PI/4,0),e.mesh(Xu,!1)}function yp(e,t){let n=ff[e.theme],r=pf.find(e=>e.id===t)||pf[0];return{...n,...r.over}}function bp(e,t){let n=md(e.length*991);return pd(256,256,(r,i,a)=>{if(r.fillStyle=t,r.fillRect(0,0,i,a),e===`planks`)for(let e=0;e<8;e++){let t=e*32,a=-(e*57%128);for(;a<i;){let e=90+n()*80,i=.88+n()*.2;r.fillStyle=`rgba(${i>1?255:0},${i>1?240:0},${i>1?220:0},${Math.abs(1-i)*.9})`,r.fillRect(a,t,e,32),r.strokeStyle=`rgba(70,40,20,0.35)`,r.lineWidth=2,r.strokeRect(a+1,t+1,e-2,30),r.strokeStyle=`rgba(90,50,20,0.12)`,r.lineWidth=1;for(let i=0;i<3;i++){r.beginPath();let i=t+6+n()*20;r.moveTo(a+4,i),r.bezierCurveTo(a+e*.3,i+3,a+e*.6,i-3,a+e-4,i),r.stroke()}a+=e}}else if(e===`tiles`)for(let e=0;e<4;e++)for(let t=0;t<4;t++)r.fillStyle=(e+t)%2?`rgba(0,0,0,0.05)`:`rgba(255,255,255,0.12)`,r.fillRect(e*64,t*64,64,64),r.strokeStyle=`rgba(80,90,100,0.25)`,r.lineWidth=2,r.strokeRect(e*64,t*64,64,64);else if(e===`tatami`)for(let e=0;e<2;e++)for(let t=0;t<4;t++){let n=e*128+t%2*64;r.fillStyle=`rgba(0,0,0,0.04)`,r.fillRect(n,t*64,128,64),r.strokeStyle=`rgba(60,70,20,0.18)`,r.lineWidth=1;for(let e=0;e<64;e+=4)r.beginPath(),r.moveTo(n,t*64+e),r.lineTo(n+128,t*64+e),r.stroke();r.strokeStyle=`#3a4a2a`,r.lineWidth=5,r.strokeRect(n+2,t*64+2,124,60)}else if(e===`metal`)for(let e=0;e<4;e++)for(let t=0;t<4;t++){r.fillStyle=(e+t)%2?`rgba(0,0,0,0.06)`:`rgba(255,255,255,0.08)`,r.fillRect(e*64+2,t*64+2,60,60),r.strokeStyle=`rgba(40,50,70,0.4)`,r.lineWidth=3,r.strokeRect(e*64+2,t*64+2,60,60),r.fillStyle=`rgba(40,50,70,0.4)`;for(let[n,i]of[[8,8],[56,8],[8,56],[56,56]])r.beginPath(),r.arc(e*64+n,t*64+i,2.5,0,Math.PI*2),r.fill()}else if(e===`asphalt`||e===`sand`||e===`gravel`){let t=e===`gravel`?900:1600;for(let o=0;o<t;o++){r.fillStyle=n()>.5?`rgba(255,255,255,${.04+n()*.08})`:`rgba(0,0,0,${.04+n()*.08})`;let t=e===`gravel`?2+n()*5:1+n()*2.5;r.beginPath(),r.arc(n()*i,n()*a,t,0,Math.PI*2),r.fill()}}else if(e===`void`)for(let e=0;e<60;e++)r.fillStyle=`rgba(255,255,255,${n()*.5})`,r.fillRect(n()*i,n()*a,1.5,1.5)},!0)}var xp=new fo(1,1);xp.rotateX(-Math.PI/2);var Sp=class{constructor(e,t,n,r,i,a=`unlock`){this.canvas=document.createElement(`canvas`),this.canvas.width=256,this.canvas.height=256,this.ctx=this.canvas.getContext(`2d`),this.tex=new Ii(this.canvas),this.tex.colorSpace=qe,this.tex.anisotropy=4;let o=new $r({map:this.tex,transparent:!0,depthWrite:!1});this.mesh=new di(xp,o),this.mesh.position.set(r,.03,i),this.mesh.renderOrder=2,this.size=a===`next`?2:1.7,this.mesh.scale.set(this.size,1,this.size),this.label=e,this.icon=t,this.cost=n,this.kind=a,this.lastP=-1,this.lastAfford=null,this.draw(0,!0)}draw(e,t){e=Math.min(this.cost,Math.max(0,Math.round(e)));let n=e/this.cost;if(e===this.lastP&&t===this.lastAfford)return;this.lastP=e,this.lastAfford=t;let r=this.ctx;r.clearRect(0,0,256,256);let i=this.kind===`next`?`#ff9a3c`:`#35c46a`,a=this.kind===`next`?`#a3500a`:`#167a3a`;if(r.fillStyle=`rgba(0,0,0,0.25)`,Wf(r,10,16,236,236,34),r.fill(),r.fillStyle=t?i:`#7f9a88`,this.kind===`next`&&!t&&(r.fillStyle=`#b89070`),Wf(r,10,8,236,236,34),r.fill(),n>0){r.save(),Wf(r,10,8,236,236,34),r.clip(),r.fillStyle=this.kind===`next`?`#ffd23f`:`#9ff06a`;let e=236*n;r.fillRect(10,244-e,236,e),r.restore()}r.lineWidth=8,r.strokeStyle=`#ffffff`,Wf(r,14,12,228,228,30),r.stroke(),r.save(),r.translate(74.24,16);let o=107.52;this.icon.menu?Jf(r,this.icon.menu,o):Cp(r,this.icon.glyph,o),r.restore(),r.fillStyle=`#ffffff`,r.strokeStyle=a,r.lineJoin=`round`,r.lineWidth=9,r.textAlign=`center`,r.font=`bold 38px system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`,r.strokeText(this.label,128,164),r.fillText(this.label,128,164);let s=this.cost-e;r.font=`bold 56px system-ui, -apple-system, sans-serif`;let c=wp(s),l=r.measureText(c).width;r.lineWidth=10,r.strokeText(c,148,226),r.fillText(c,148,226);let u=148-l/2-30;r.fillStyle=`#ffc83d`,r.beginPath(),r.arc(u,207,20,0,Math.PI*2),r.fill(),r.lineWidth=5,r.strokeStyle=`#b9770e`,r.stroke(),this.tex.needsUpdate=!0}};function Cp(e,t,n){e.lineJoin=`round`,e.lineCap=`round`;let r=`#ffffff`;switch(e.fillStyle=r,e.strokeStyle=r,e.lineWidth=n*.08,t){case`seat`:e.beginPath(),e.ellipse(n*.5,n*.35,n*.3,n*.12,0,0,Math.PI*2),e.fill(),e.fillRect(n*.44,n*.35,n*.12,n*.45),e.fillRect(n*.25,n*.8,n*.5,n*.08);break;case`sink`:e.beginPath(),e.ellipse(n*.5,n*.6,n*.4,n*.22,0,0,Math.PI*2),e.fill(),e.beginPath(),e.moveTo(n*.3,n*.2),e.lineTo(n*.5,n*.1),e.lineTo(n*.5,n*.4),e.stroke(),e.fillStyle=`#5ab4e6`,e.beginPath(),e.ellipse(n*.5,n*.58,n*.22,n*.1,0,0,Math.PI*2),e.fill();break;case`staff`:case`hauler`:e.beginPath(),e.arc(n*.5,n*.3,n*.18,0,Math.PI*2),e.fill(),e.beginPath(),e.moveTo(n*.15,n*.95),e.quadraticCurveTo(n*.5,n*.35,n*.85,n*.95),e.fill(),e.fillStyle=t===`hauler`?`#2f9e5a`:`#2f6fd8`,e.fillRect(n*.3,n*.1,n*.4,n*.1);break;case`upgrade`:e.beginPath(),e.moveTo(n*.5,n*.05),e.lineTo(n*.92,n*.5),e.lineTo(n*.66,n*.5),e.lineTo(n*.66,n*.95),e.lineTo(n*.34,n*.95),e.lineTo(n*.34,n*.5),e.lineTo(n*.08,n*.5),e.closePath(),e.fill();break;case`belt`:e.beginPath(),e.ellipse(n*.5,n*.5,n*.42,n*.26,0,0,Math.PI*2),e.stroke(),e.beginPath(),e.moveTo(n*.82,n*.3),e.lineTo(n*.95,n*.5),e.lineTo(n*.72,n*.52),e.fill();break;case`lever`:e.beginPath(),e.moveTo(n*.5,n*.9),e.lineTo(n*.72,n*.2),e.stroke(),e.beginPath(),e.arc(n*.74,n*.18,n*.13,0,Math.PI*2),e.fill(),e.fillRect(n*.25,n*.82,n*.5,n*.14);break;case`next`:e.beginPath(),e.moveTo(n*.1,n*.5),e.lineTo(n*.5,n*.15),e.lineTo(n*.9,n*.5),e.closePath(),e.fill(),e.fillRect(n*.2,n*.5,n*.6,n*.42),e.fillStyle=`#ff9a3c`,e.fillRect(n*.42,n*.62,n*.16,n*.3);break;case`final`:e.beginPath();for(let t=0;t<10;t++){let r=-Math.PI/2+t*Math.PI/5,i=t%2?n*.18:n*.42;e.lineTo(n*.5+Math.cos(r)*i,n*.52+Math.sin(r)*i)}e.closePath(),e.fill()}}Sp.prototype.dispose=function(){this.tex.dispose(),this.mesh.material.dispose()};function wp(e){return e=Math.floor(e),e<1e3?String(e):e<1e6?(e/1e3).toFixed(+(e<1e4)).replace(/\.0$/,``)+`K`:e<1e9?(e/1e6).toFixed(e<1e7?2:1).replace(/\.0+$/,``)+`M`:(e/1e9).toFixed(2)+`B`}function Tp(e,t,n){let r=new Rn,{x0:i,x1:a,z0:o,z1:s}=t.bounds,c=a-i,l=s-o;U.scene.background=new Gn(n.bg),U.scene.fog=null;let u=bp(n.groundTex,n.ground);u.repeat.set(12,12);let d=s-o+40,f=new di(new fo(90,d),new Eo({map:u}));f.matrixAutoUpdate=!0,u.repeat.set(12,d/7.5),f.rotation.x=-Math.PI/2,f.position.set(0,-.02,o-.9+d/2),f.receiveShadow=!0,r.add(f);let p=bp(n.floor,n.floorColor);p.repeat.set(c/4,l/4);let m=new Eo({map:p,color:n.floorTint||`#ffffff`}),h=t.kitchenZ+1.9,g=s-h;p.repeat.set(c/4,g/4);let _=new di(new fo(c,g),m);_.rotation.x=-Math.PI/2,_.position.set((i+a)/2,0,(h+s)/2),_.receiveShadow=!0,r.add(_);let v=new W;v.add(G.box(c,.012,t.kitchenZ+1.9-o),`#e9e4da`,(i+a)/2,.006,(o+t.kitchenZ+1.9)/2);let y=v.mesh(Yu,!1);y.receiveShadow=!0,r.add(y);let b=bp(`tiles`,`#f2efe8`);b.repeat.set(c/2,(t.kitchenZ+1.9-o)/2),y.material=new Eo({map:b,color:n.floor===`metal`?`#c8d0e0`:`#ffffff`});let x=new W;x.add(G.box(c,.03,.12),n.accent,(i+a)/2,.015,t.kitchenZ+1.9);let S=1.1,C=.3;x.add(G.box(C,S,l+C),n.wall,i-C/2,S/2,(o+s)/2),x.add(G.box(C,S,l+C),n.wall,a+C/2,S/2,(o+s)/2),x.add(G.box(.36,.1,l+C+.06),n.wallTrim,i-C/2,S,(o+s)/2),x.add(G.box(.36,.1,l+C+.06),n.wallTrim,a+C/2,S,(o+s)/2);let w=1.4,T=(c-w*2)/2;x.add(G.box(T,.55,C),n.wall,i+T/2,.275,s+C/2),x.add(G.box(T,.55,C),n.wall,a-T/2,.275,s+C/2),x.add(G.box(T,.06,.36),n.wallTrim,i+T/2,.55,s+C/2),x.add(G.box(T,.06,.36),n.wallTrim,a-T/2,.55,s+C/2);for(let e of[-1,1])x.add(G.box(.22,2.6,.22),n.wallTrim===`#f7f3ea`?`#6b3a2a`:n.wall,e*w,1.3,s+C/2);x.add(G.box(3.4,.22,.3),n.wall,0,2.6,s+C/2),r.add(x.mesh());let E=new W;for(let e=0;e<3;e++)E.add(G.box(.86,.9,.012),n.noren,-.9+e*.9,-.45,0);E.add(G.cyl(.16,.16,.02,16),`#ffffff`,0,-.45,.012,Math.PI/2);let D=E.mesh(Yu,!0);D.position.set(0,2.5,s+.02),r.add(D),r.userData.noren=D;let ee=new W;ee.add(G.box(c+.6,.2,1.4),e.theme===`space`?`#4a5270`:`#8a5a36`,(i+a)/2,-.08,o-.3);for(let t=i;t<=a;t+=1.6)ee.add(G.cyl(.12,.12,1.4,8),e.theme===`space`?`#3de0ff`:`#5a3a22`,t,-.2,o-1);for(let e=i+.4;e<=a;e+=2.2)ee.add(G.cyl(.06,.06,.7,6),`#6a4a2a`,e,.35,o-.9);ee.add(G.box(c,.07,.07),`#6a4a2a`,(i+a)/2,.68,o-.9),r.add(ee.mesh());let O={alley:`#1d3a5a`,mall:`#3fa9d8`,beach:`#2ec4d8`,ryokan:`#2a5a4a`,space:`#000000`}[e.theme],k=new di(new fo(90,30),new $r({color:O}));k.rotation.x=-Math.PI/2,k.position.set(0,-.25,o-16),r.add(k),r.userData.water=k;let A=new W,j=new W;if(e.theme!==`space`){let t=i+3.2,r=o-2.6;A.add(G.rbox(4.2,.7,1.6,.7),e.theme===`mall`?`#ffffff`:`#b0582e`,t,-.05,r),A.add(G.rbox(4.3,.12,1.7,.72),`#f4f0e0`,t,.32,r),A.add(G.rbox(1.3,.8,1,.15),`#f7f3ea`,t+.8,.75,r),A.add(G.box(1.4,.1,1.1),n.accent,t+.8,1.18,r),A.add(G.cyl(.05,.05,1.8,6),`#6a4a2a`,t-.9,1.2,r);for(let e=0;e<3;e++)A.add(G.box(.5,.35,.4),`#9a6a3a`,t-1.4+e*.55,.55,r+.1);_p(j,t-.9,2,r,n.lantern,.6),A.add(G.rbox(2.6,.5,1.1,.5),`#3f6fae`,a-2.8,-.1,o-3.2),A.add(G.rbox(2.7,.1,1.2,.52),`#f4f0e0`,a-2.8,.18,o-3.2)}else{let e=i+3.2,t=o-2.8;A.add(G.cap(.8,2.4,10),`#e8ecf5`,e,.2,t,0,0,Math.PI/2),A.add(G.cone(.5,.8,8),`#ff3fa4`,e+2.1,.2,t,0,0,-Math.PI/2),j.add(G.cyl(.3,.3,.1,10),`#3de0ff`,e-.6,.85,t,0,0,0),j.add(G.sph(.25,8,6),`#3de0ff`,e-2.2,.2,t)}let M=md(e.id.length*77+3);for(let e=o+2;e<s-1;e+=3.2)for(let t of[i-.15,a+.15])A.add(G.cyl(.05,.05,1.3,6),`#3a2a22`,t,1.75,e),A.add(G.cyl(.07,.07,.07,8),`#2a1a14`,t,2.35,e),_p(j,t,2.1,e,n.lantern,.9);for(let e of[-1,1])_p(j,e*1.9,2,s+.4,n.lantern,1.1),A.add(G.cyl(.03,.03,.5,5),`#2a1a14`,e*1.9,2.55,s+.4);if(A.add(G.rbox(3.2,.7,.14,.12),n.wall,0,3.15,s+.12),r.add(Dp(e.name,n,s+.2)),e.theme===`alley`){for(let e of[-1,1])for(let n=0;n<4;n++){let r=3+M()*3,i=e*(t.halfW+2.4+M()*.6),a=o+2+n*5.2;A.add(G.box(3.4,r,4.6),[`#3a3550`,`#4a3a48`,`#35405a`][n%3],i,r/2,a);for(let t=0;t<3;t++)j.add(G.box(.05,.5,.6),M()>.4?`#ffd88a`:`#5a6080`,i-e*1.72,1.2+t*1.1,a-1+M()*2)}for(let e=i+.5;e<a;e+=.9)j.add(G.sph(.07,6,5),[`#ffd23f`,`#ff6a5a`,`#7fd4ff`][Math.floor(M()*3)],e,2.3-Math.sin((e-i)/c*Math.PI)*.4,s+.6);for(let e of[-1,1])A.add(G.cyl(.07,.09,3.2,8),`#2a2e3a`,e*4.2,1.6,s+2.2),j.add(G.sph(.22,10,8),`#fff2c0`,e*4.2,3.25,s+2.2);for(let e=0;e<5;e++)A.add(G.box(.7,.5,.6),`#9a6a3a`,a+1.2+M(),.25+e%2*.5,o+3+e*.4,0,M(),0)}else if(e.theme===`mall`){for(let e of[-1,1])for(let n=0;n<4;n++){let r=e*(t.halfW+2.6),i=o+2+n*5;A.add(G.box(3.2,3.4,4.4),`#ffffff`,r,1.7,i),j.add(G.box(.06,.6,3.6),[`#ff6b5a`,`#4fb0ff`,`#ffc83d`,`#58c7b4`][n],r-e*1.62,2.8,i),A.add(G.box(.05,1.8,3.4),`#bfe6ff`,r-e*1.61,1.1,i)}for(let[e,n]of[[i+.6,s-.6],[a-.6,s-.6],[i+.6,t.kitchenZ+2.6],[a-.6,t.kitchenZ+2.6]])A.add(G.cyl(.3,.24,.5,10),`#ffffff`,e,.25,n),A.add(G.sph(.45,10,8),`#3fae5a`,e,.85,n),A.add(G.sph(.32,10,8),`#5fcf6a`,e+.15,1.15,n+.1);for(let e of[-1,1])A.add(G.cyl(.3,.3,4,12),`#f4f0e8`,e*(t.halfW+.6),2,s+.6)}else if(e.theme===`beach`){for(let e=0;e<10;e++)Ep(A,(e%2?1:-1)*(t.halfW+1.6+M()*3),o+M()*(l+6),M);for(let e=0;e<4;e++){let t=-6+e*4+M(),n=s+3+M()*2;A.add(G.cyl(.04,.04,2,6),`#ffffff`,t,1,n),A.add(G.cone(1.1,.5,8),[`#ff6b5a`,`#4fb0ff`,`#ffc83d`,`#ff8fb8`][e],t,2.1,n)}A.add(G.rbox(.5,.08,1.8,.24),`#ff7a3a`,a+.8,.8,s-2,1.2,0,.2)}else if(e.theme===`ryokan`){for(let e=0;e<14;e++){let n=(e%2?1:-1)*(t.halfW+1+M()*3),r=o+M()*(l+4),i=3+M()*2.5;A.add(G.cyl(.08,.1,i,6),`#6fae4a`,n,i/2,r);for(let e=1;e<i;e+=.7)A.add(G.cyl(.1,.1,.05,6),`#4f8e3a`,n,e,r);A.add(G.cone(.5,1.2,5),`#3f7e3a`,n,i,r)}for(let e of[-1,1]){let n=e*(t.halfW+1.2),r=s-1;A.add(G.box(.6,.3,.6),`#9a9a8a`,n,.15,r),A.add(G.cyl(.1,.12,.6,6),`#9a9a8a`,n,.6,r),A.add(G.box(.7,.1,.7),`#8a8a7a`,n,1.3,r),j.add(G.box(.4,.35,.4),`#ffcf7a`,n,1.08,r),A.add(G.cone(.55,.4,4),`#8a8a7a`,n,1.55,r,0,Math.PI/4,0)}let e=new di(new Hi(1.8,20),new Eo({color:`#3a7a8a`}));e.rotation.x=-Math.PI/2,e.position.set(a+3.2,.01,s-4),r.add(e)}else if(e.theme===`space`){let e=new Vr,n=[];for(let e=0;e<500;e++)n.push((M()-.5)*90,-2-M()*6,(M()-.5)*90);e.setAttribute(`position`,new kr(n,3)),r.add(new Ni(e,new Oi({color:16777215,size:.12})));let u=new di(new mo(4,24,16),new Eo({color:`#ff8fb8`,emissive:`#3a1030`}));u.position.set(a+8,-3,o-6),r.add(u);let d=new di(new ho(6,.3,4,40),new Eo({color:`#ffd9a0`,emissive:`#403020`}));d.position.copy(u.position),d.rotation.x=1.2,r.add(d),j.add(G.box(c,.05,.05),`#3de0ff`,(i+a)/2,.03,s-.1),j.add(G.box(.05,.05,l),`#ff3fa4`,i+.1,.03,(o+s)/2),j.add(G.box(.05,.05,l),`#ff3fa4`,a-.1,.03,(o+s)/2);for(let e of[-1,1])A.add(G.box(.4,3,.4),`#5a6488`,e*(t.halfW+.2),1.5,s+.2)}r.add(A.mesh());let te=j.mesh(Xu,!1);return r.add(te),r}function Ep(e,t,n,r){let i=2.6+r()*1.4;for(let r=0;r<6;r++)e.add(G.cyl(.14-r*.01,.16-r*.01,i/6,7),`#a0764a`,t+r*.05,i/6*(r+.5),n);for(let r=0;r<6;r++){let a=r/6*Math.PI*2;e.add(G.box(1.4,.05,.36),`#3faa4a`,t+.3+Math.cos(a)*.6,i+.05,n+Math.sin(a)*.6,0,-a,-.35)}e.add(G.sph(.12,6,5),`#6a4a2a`,t+.3,i-.1,n+.1)}function Dp(e,t,n){let r=pd(512,112,(n,r,i)=>{n.fillStyle=t.wall,n.fillRect(0,0,r,i),n.strokeStyle=t.wallTrim,n.lineWidth=8,n.strokeRect(6,6,r-12,i-12),n.fillStyle=`#ffffff`,n.font=`bold 56px system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`,n.textAlign=`center`,n.textBaseline=`middle`,n.fillText(e,r/2,i/2+2)}),i=new di(new fo(3.1,.68),new $r({map:r}));return i.position.set(0,3.15,n),i}function Op(e,t,n){let r={stations:{},crates:{},sink:null,rack:null,desk:null,trash:[],stools:{},lever:null};for(let e of t.stations){let t=up(e.menu,n);t.position.set(e.x,0,e.z),r.stations[e.menu]=t;let i=dp(e.ing,n);i.position.set(e.crate.x,0,e.crate.z),r.crates[e.menu]=i}return r.sink=pp(n),r.sink.position.set(t.sink.x,0,t.sink.z),r.rack=fp(),r.rack.position.set(t.rack.x,0,t.rack.z),r.desk=hp(n),r.desk.position.set(t.upgrade.desk.x,0,t.upgrade.desk.z),t.m<0&&(r.desk.rotation.y=Math.PI),r.trash=t.trashes.map(e=>{let t=mp();return t.position.set(e.bin.x,0,e.bin.z),t}),t.lever&&(r.lever=gp(),r.lever.position.set(t.lever.model.x,0,t.lever.model.z)),r}function kp(e,t,n){let r=new W,i=new W,a=[],{x0:o,x1:s,z1:c}=t.bounds;t.m;let l=e.theme,u=-1e9;for(let n of t.belts)u=Math.max(u,n.topZ+e.layout.len1+n.r+.85);let d=(e,t,n,r)=>a.push({t:`box`,x:e,z:t,hw:n,hd:r}),f=c-.45,p=(e,t,n,i)=>{r.add(G.cyl(.3,.24,.45,10),n,e,.225,t),r.add(G.sph(.38,10,8),i,e,.72,t),r.add(G.sph(.26,8,6),i,e+.14,.98,t+.06),d(e,t,.32,.32)},m=(e,t,n)=>{r.add(G.rbox(1.5,.1,.46,.06),n,e,.46,t),r.add(G.box(1.5,.36,.08),n,e,.7,t+.2);for(let n of[-.62,.62])r.add(G.box(.08,.42,.4),`#4a4a55`,e+n,.21,t);d(e,t,.78,.3)};if(-(t.halfW-.5),t.halfW-.5,l===`alley`){let e=-3.2;r.add(G.rbox(.5,.55,.4,.14),`#ffffff`,e,.3,f),r.add(G.sph(.24,10,8),`#ffffff`,e,.78,f),r.add(G.cone(.08,.14,4),`#ffffff`,-3.3400000000000003,.99,f,0,.8,-.3),r.add(G.cone(.08,.14,4),`#ffffff`,-3.06,.99,f,0,.8,.3),r.add(G.cap(.06,.24,6),`#ffffff`,-2.98,.95,f+.05,0,0,-.3),r.add(G.sph(.05,6,5),`#e2394f`,e,.58,f+.2),r.add(G.cyl(.12,.12,.02,10),`#ffc83d`,e,.4,f+.21,Math.PI/2),d(e,f,.3,.25);for(let[e,t]of[[-4.6,1],[-5.3,.8]])r.add(G.cyl(.32*t,.32*t,.6*t,12),`#a8743e`,e,.3*t,f),r.add(G.cyl(.33*t,.33*t,.05,12),`#3a2a22`,e,.12*t,f),r.add(G.cyl(.33*t,.33*t,.05,12),`#3a2a22`,e,.48*t,f),r.add(G.rbox(.3*t,.2*t,.02,.03),`#ffffff`,e,.32*t,f+.33*t),d(e,f,.33*t,.33*t);for(let e of[3.4,5.2]){r.add(G.rbox(.6,.4,.6,.08),`#5a3a22`,e,.2,f);for(let t=0;t<4;t++){let n=1.2+t*.25;r.add(G.cyl(.04,.05,n,6),`#6fae4a`,e-.15+t%2*.3,.4+n/2,f-.12+Math.floor(t/2)*.24),r.add(G.cone(.14,.4,5),`#4f8e3a`,e-.15+t%2*.3,.4+n,f-.12+Math.floor(t/2)*.24)}d(e,f,.32,.32)}let n=t.belts[0].cx,a=u+2.35;r.add(G.rbox(1.6,.5,.7,.06),`#3a2a22`,n,.25,a),i.add(G.box(1.46,.62,.56),`#3aa0d8`,n,.82,a),r.add(G.box(1.6,.06,.7),`#3a2a22`,n,1.15,a);for(let e=0;e<4;e++)i.add(G.sph(.07,6,5),[`#ff8a4c`,`#ffd23f`,`#ff5a7a`,`#ffffff`][e],n-.5+e*.32,.75+e%2*.15,a+.29,0,0,0,1.6,.8,.6);d(n,a,.82,.37)}else if(l===`mall`){p(-3,f,`#ffffff`,`#3fae5a`),p(3.4,f,`#ffffff`,`#5fcf6a`),m(-4.8,f-.05,`#58c7b4`),r.add(G.rbox(.9,1.7,.6,.08),`#e8483b`,5.4,.85,f-.05),i.add(G.box(.7,.9,.02),`#bfe6ff`,5.35,1.15,f+.26);for(let e=0;e<3;e++)r.add(G.cyl(.06,.06,.2,8),[`#ffd23f`,`#4fb0ff`,`#6ee07a`][e],5.15+e*.2,1.15,f+.24);d(5.4,f-.05,.46,.32);let e=u+1.8;r.add(G.cyl(.85,.9,.35,20),`#e9e4da`,0,.175,e),i.add(G.cyl(.72,.72,.04,20),`#7fd4ff`,0,.34,e),r.add(G.cyl(.12,.16,.7,10),`#e9e4da`,0,.6,e),i.add(G.sph(.2,8,6),`#bfeaff`,0,1,e,0,0,0,1,1.4,1),d(0,e,.9,.9);let n=t.escalator;if(n){let e=u-2;n.z=e+1.8,r.add(G.box(.9,.12,2.2),`#7a8494`,n.x,.06,e);for(let t=0;t<7;t++)r.add(G.box(.78,.05,.22),`#c9ccd6`,n.x,.14-t*0,e-1+t*.3);for(let t of[-.47,.47])r.add(G.box(.06,.8,2.2),`#dfe6f2`,n.x+t,.45,e),i.add(G.box(.08,.06,2.2),`#58c7b4`,n.x+t,.88,e);i.add(G.box(.8,.04,.3),`#ffd23f`,n.x,.17,e+1.05),d(n.x,e,.5,1.1)}}else if(l===`beach`){for(let[e,t]of[[-3.1,`#ff7a3a`],[-4.9,`#4fb0ff`]]){r.add(G.box(.6,.06,1.2),t,e,.32,f-.4,-.15,0,0),r.add(G.box(.6,.06,.6),t,e,.55,f-1.05,.9,0,0);for(let t of[-.26,.26])r.add(G.cyl(.03,.03,.34,5),`#ffffff`,e+t,.17,f-.4);d(e,f-.6,.34,.66)}r.add(G.cyl(.04,.04,2.2,6),`#ffffff`,-4,1.1,f-.2),r.add(G.cone(1.3,.5,10),`#ff5a7a`,-4,2.2,f-.2);for(let[e,t,n]of[[3.2,`#ffd23f`,.1],[3.7,`#4fb0ff`,-.1],[4.2,`#ff7a3a`,.05]])r.add(G.rbox(.4,.08,1.7,.2),t,e,.85,f-.1,1.45,0,n);d(3.7,f-.1,.8,.25);for(let e of[5.4,-6.4])r.add(G.cyl(.05,.07,1.5,6),`#8a5a2e`,e,.75,f),r.add(G.cyl(.14,.1,.25,8),`#5a3a1e`,e,1.55,f),i.add(G.cone(.12,.35,6),`#ffb13d`,e,1.85,f),d(e,f,.15,.15);let e=u+1.75;r.add(G.cyl(.9,1,.25,14),`#f3d9a2`,0,.12,e),r.add(G.cyl(.35,.4,.5,8),`#e9c98a`,0,.5,e);for(let t of[0,1.6,3.2,4.8])r.add(G.cyl(.14,.16,.45,6),`#e9c98a`,Math.cos(t)*.6,.45,e+Math.sin(t)*.5);r.add(G.cone(.1,.25,4),`#ff5a3c`,0,.9,e),d(0,e,1,1)}else if(l===`ryokan`){for(let e of[-3,3.4])r.add(G.box(.5,.25,.5),`#9a9a8a`,e,.125,f),r.add(G.cyl(.08,.1,.5,6),`#9a9a8a`,e,.5,f),r.add(G.box(.55,.08,.55),`#8a8a7a`,e,1.1,f),i.add(G.box(.34,.3,.34),`#ffcf7a`,e,.9,f),r.add(G.cone(.45,.35,4),`#8a8a7a`,e,1.32,f,0,Math.PI/4,0),d(e,f,.3,.3);for(let e of[-4.8,5.2])r.add(G.rbox(.8,.45,.5,.06),`#5a3a2a`,e,.22,f),r.add(G.cyl(.25,.2,.18,10),`#3a4a5a`,e,.54,f),r.add(G.cyl(.04,.06,.4,5),`#6a4a2a`,e,.8,f,0,0,.3),r.add(G.sph(.3,8,6),`#3f7e3a`,e-.12,1.02,f,0,0,0,1.3,.6,1),r.add(G.sph(.22,8,6),`#4f8e3a`,e+.18,1.1,f,0,0,0,1.2,.6,1),d(e,f,.42,.28);for(let e=o+.3;e<-1.6;e+=.22)r.add(G.cyl(.05,.05,1.3,5),`#8fbf5a`,e,.65,c-.12);for(let e=1.6;e<s-.2;e+=.22)r.add(G.cyl(.05,.05,1.3,5),`#8fbf5a`,e,.65,c-.12);let e=u+1.8;r.add(G.rbox(2.2,.06,1.2,.3),`#e8e2d0`,0,.03,e);for(let[t,n,i]of[[-.5,-.1,.3],[.4,.2,.22],[.75,-.3,.15]])r.add(new lo(i,0),`#7a7a70`,t,i*.6,e+n);for(let t=0;t<5;t++)r.add(G.torus(.35+t*.12,.012,3,24,Math.PI),`#c9c2ae`,-.5,.065,e-.1,-Math.PI/2,0,0);d(0,e,1.1,.6)}else if(l===`space`){let e=-3.2;r.add(G.cyl(.35,.4,.3,10),`#5a6488`,e,.15,f),r.add(G.cap(.24,.3,8),`#e8ecf5`,e,.75,f),r.add(G.sph(.24,10,8),`#e8ecf5`,e,1.22,f),i.add(G.sph(.16,8,6),`#3de0ff`,e,1.23,f+.12,0,0,0,1.2,.8,.5),d(e,f,.4,.4),r.add(G.rbox(.6,1,.4,.06),`#3a4466`,3.2,.5,f),i.add(G.box(.5,.35,.02),`#3de0ff`,3.2,.8,f+.21),i.add(G.cone(.3,.6,12),`#ff3fa4`,3.2,1.45,f,Math.PI,0,0),d(3.2,f,.32,.22);for(let e of[-4.9,5]){r.add(G.cyl(.4,.45,.2,12),`#5a6488`,e,.1,f),r.add(G.sph(.35,10,8),`#5fcf6a`,e,.45,f,0,0,0,1,.8,1);let t=new mo(.42,12,8,0,Math.PI*2,0,Math.PI/2);i.add(t,`#8fd8ff`,e,.2,f,0,0,0,1,1,1),d(e,f,.45,.45)}let t=u+1.75;r.add(G.cyl(.7,.8,.2,16),`#3a4466`,0,.1,t),i.add(G.sph(.4,12,10),`#ff8fb8`,0,1,t),i.add(G.torus(.62,.03,4,32),`#3de0ff`,0,1,t,1.2,0,0),d(0,t,.8,.8)}return{mesh:r.mesh(),glowMesh:i.parts.length?i.mesh(Xu,!1):null,obs:a}}function Ap(e,t,n){let r=new W,i=e.r-.5,a=e.len,o=-a/2+.25,s=a/2-.25;if(r.add(G.rbox(i*2-.1,.5,a+i*1.2,.5),t===`space`?`#3a4466`:t===`mall`?`#d8d2c6`:`#6a4a3a`,0,.25,0),t===`alley`)r.add(G.cyl(.1,.1,.5,8),`#ffffff`,-.2,.75,o),r.add(G.cyl(.1,.1,.5,8),`#6fae4a`,.2,.75,o),r.add(G.cyl(.25,.2,.3,10),`#e8e0d0`,0,.65,s),r.add(G.sph(.32,10,8),`#ff8fb8`,0,.98,s),r.add(G.cyl(.03,.03,.9,5),`#3a2a22`,0,.95,0),r.add(G.sph(.2,10,8),n.lantern,0,1.45,0,0,0,0,1,1.25,1);else if(t===`mall`)r.add(G.cyl(.25,.2,.3,10),`#ffffff`,0,.65,o),r.add(G.sph(.35,10,8),`#ff8fb8`,0,1,o),r.add(G.cyl(.25,.2,.3,10),`#ffffff`,0,.65,s),r.add(G.sph(.35,10,8),`#ffd23f`,0,1,s),r.add(G.rbox(.9,.5,.1,.08),`#58c7b4`,0,1.1,0);else if(t===`beach`){r.add(G.cyl(.06,.08,1.2,6),`#a0764a`,0,1.1,0);for(let e=0;e<5;e++)r.add(G.box(.8,.04,.22),`#3faa4a`,Math.cos(e*1.26)*.3,1.7,Math.sin(e*1.26)*.3,0,-e*1.26,-.4);r.add(G.sph(.18,8,6),`#ffb0c8`,0,.6,o,0,0,0,1.3,.5,1),r.add(G.cone(.16,.3,6),`#fff0d0`,0,.65,s)}else t===`ryokan`?(r.add(G.cyl(.3,.3,.06,14),`#3a6a8a`,0,.53,o+.3),r.add(G.cyl(.04,.06,.4,5),`#6a4a2a`,0,.7,s,0,0,.3),r.add(G.sph(.28,8,6),`#3f7e3a`,-.1,.95,s,0,0,0,1.3,.6,1),r.add(G.box(.3,.2,.3),`#9a9a8a`,0,.6,0),r.add(G.cone(.28,.25,4),`#8a8a7a`,0,.85,0,0,Math.PI/4,0)):(r.add(G.cyl(.2,.25,.2,10),`#5a6488`,0,.6,0),r.add(G.sph(.26,10,8),`#ff8fb8`,0,1.05,0),r.add(G.torus(.4,.025,4,28),`#3de0ff`,0,1.05,0,1.2,0,0),r.add(G.sph(.2,8,6),`#5fcf6a`,0,.7,o),r.add(G.sph(.2,8,6),`#5fcf6a`,0,.7,s));return r.mesh()}var jp=class{constructor(e){this.bounds=e,this.obs=[],this.nodes=[],this.edges=null}setObstacles(e){this.obs=e,this.buildGraph()}collide(e,t){for(let n=0;n<2;n++)for(let n of this.obs)if(n.t===`box`){let r=Math.max(n.x-n.hw,Math.min(e.x,n.x+n.hw)),i=Math.max(n.z-n.hd,Math.min(e.z,n.z+n.hd)),a=e.x-r,o=e.z-i,s=a*a+o*o;if(s<t*t){if(s>1e-8){let n=Math.sqrt(s);e.x=r+a/n*t,e.z=i+o/n*t}else{let r=[n.x-n.hw-t-e.x,n.x+n.hw+t-e.x],i=[n.z-n.hd-t-e.z,n.z+n.hd+t-e.z],a=[r[0],r[1],i[0],i[1]],o=0;for(let e=1;e<4;e++)Math.abs(a[e])<Math.abs(a[o])&&(o=e);o<2?e.x+=a[o]:e.z+=a[o]}}}else{let r=Math.max(n.z0,Math.min(e.z,n.z1)),i=e.x-n.x,a=e.z-r,o=Math.hypot(i,a),s=n.rad+t;o<s&&(o>1e-6?(e.x=n.x+i/o*s,e.z=r+a/o*s):e.x=n.x+s)}let n=this.bounds;e.x=Math.max(n.x0+t,Math.min(n.x1-t,e.x)),e.z=Math.max(n.z0+t,Math.min(n.z1-t,e.z))}inside(e,t,n){let r=this.bounds;if(e<r.x0+.2||e>r.x1-.2||t<r.z0+.2||t>r.z1-.2)return!0;for(let r of this.obs)if(r.t===`box`){if(Math.abs(e-r.x)<r.hw+n&&Math.abs(t-r.z)<r.hd+n)return!0}else{let i=Math.max(r.z0,Math.min(t,r.z1));if(Math.hypot(e-r.x,t-i)<r.rad+n)return!0}return!1}segClear(e,t,n,r,i){for(let a of this.obs)if(a.t===`box`){if(Mp(e,t,n,r,a.x-a.hw-i,a.z-a.hd-i,a.x+a.hw+i,a.z+a.hd+i))return!1}else if(Np(e,t,n,r,a.x,a.z0,a.x,a.z1)<a.rad+i)return!1;return!0}buildGraph(){let e=.55,t=[];for(let n of this.obs)if(n.t===`box`)for(let r of[-1,1])for(let i of[-1,1])t.push({x:n.x+r*(n.hw+e),z:n.z+i*(n.hd+e)});else{let r=n.rad+e+.1;for(let e=0;e<12;e++){let i=e/12*Math.PI*2,a=Math.sin(i)>0?n.z1:n.z0;t.push({x:n.x+Math.cos(i)*r,z:a+Math.sin(i)*r})}t.push({x:n.x+r,z:(n.z0+n.z1)/2},{x:n.x-r,z:(n.z0+n.z1)/2})}this.nodes=t.filter(e=>!this.inside(e.x,e.z,.32));let n=this.nodes.length;this.edges=Array.from({length:n},()=>[]);for(let e=0;e<n;e++)for(let t=e+1;t<n;t++){let n=this.nodes[e],r=this.nodes[t];if(this.segClear(n.x,n.z,r.x,r.z,.28)){let i=Math.hypot(n.x-r.x,n.z-r.z);this.edges[e].push([t,i]),this.edges[t].push([e,i])}}}path(e,t,n,r){if(this.segClear(e,t,n,r,.28))return[{x:n,z:r}];let i=this.nodes.length,a=i,o=i+1,s=new Float64Array(i+2).fill(1/0),c=new Int32Array(i+2).fill(-1),l=new Uint8Array(i+2),u=s=>{if(s===a){for(let n of[.28,.05]){let r=[];for(let a=0;a<i;a++){let i=this.nodes[a];this.segClear(e,t,i.x,i.z,n)&&r.push([a,Math.hypot(e-i.x,t-i.z)])}if(r.length)return r}return[]}let c=this.nodes[s],l=this.edges[s].slice();return this.segClear(c.x,c.z,n,r,.28)&&l.push([o,Math.hypot(c.x-n,c.z-r)]),l};s[a]=0;for(let e=0;e<i+2;e++){let e=-1,t=1/0;for(let n=0;n<i+2;n++)!l[n]&&s[n]<t&&(t=s[n],e=n);if(e<0||e===o)break;l[e]=1;for(let[t,n]of u(e))s[e]+n<s[t]&&(s[t]=s[e]+n,c[t]=e)}if(!isFinite(s[o]))return[{x:n,z:r}];let d=[],f=o;for(;f!==a&&f>=0;)f===o?d.push({x:n,z:r}):d.push({x:this.nodes[f].x,z:this.nodes[f].z}),f=c[f];return d.reverse()}};function Mp(e,t,n,r,i,a,o,s){let c=0,l=1,u=n-e,d=r-t,f=(e,t)=>{if(Math.abs(e)<1e-9)return t>=0;let n=t/e;if(e<0){if(n>l)return!1;n>c&&(c=n)}else{if(n<c)return!1;n<l&&(l=n)}return!0};return f(-u,e-i)&&f(u,o-e)&&f(-d,t-a)&&f(d,s-t)&&c<=l}function Np(e,t,n,r,i,a,o,s){let c=n-e,l=r-t,u=o-i,d=s-a,f=e-i,p=t-a,m=c*c+l*l,h=c*u+l*d,g=u*u+d*d,_=c*f+l*p,v=u*f+d*p,y=m*g-h*h,b,x=y,S,C=y;y<1e-9?(b=0,x=1,S=v,C=g):(b=h*v-g*_,S=m*v-h*_,b<0?(b=0,S=v,C=g):b>x&&(b=x,S=v+h,C=g)),S<0?(S=0,-_<0?b=0:-_>m?b=x:(b=-_,x=m)):S>C&&(S=C,-_+h<0?b=0:-_+h>m?b=x:(b=-_+h,x=m));let w=Math.abs(b)<1e-9?0:b/x,T=Math.abs(S)<1e-9?0:S/C,E=f+w*c-T*u,D=p+w*l-T*d;return Math.hypot(E,D)}var Pp=8,Fp=128,Ip={crate:`#f2a51c`,in:`#2f7fe0`,out:`#8a5cf0`,feed:`#2fb35a`,trash:`#e8483b`,sink:`#1fb3c9`,upgrade:`#ffb400`};function Lp(e,t,n){if(e.fillStyle=`#ffffff`,e.strokeStyle=`#ffffff`,e.lineJoin=`round`,e.lineCap=`round`,t===`feed`)e.beginPath(),e.moveTo(n*.5,n*.08),e.lineTo(n*.9,n*.48),e.lineTo(n*.64,n*.48),e.lineTo(n*.64,n*.9),e.lineTo(n*.36,n*.9),e.lineTo(n*.36,n*.48),e.lineTo(n*.1,n*.48),e.closePath(),e.fill();else if(t===`trash`){e.fillRect(n*.26,n*.32,n*.48,n*.58),e.fillRect(n*.16,n*.18,n*.68,n*.1),e.fillRect(n*.4,n*.08,n*.2,n*.1),e.fillStyle=Ip.trash;for(let t of[.37,.5,.63])e.fillRect(n*t-n*.025,n*.42,n*.05,n*.38)}else if(t===`sink`){e.beginPath(),e.ellipse(n*.5,n*.58,n*.42,n*.24,0,0,Math.PI*2),e.fill(),e.fillStyle=Ip.sink,e.beginPath(),e.ellipse(n*.5,n*.55,n*.22,n*.11,0,0,Math.PI*2),e.fill(),e.fillStyle=`#ffffff`;for(let[t,r,i]of[[.22,.2,.08],[.38,.1,.06],[.76,.2,.1]])e.beginPath(),e.arc(n*t,n*r,n*i,0,Math.PI*2),e.fill()}else t===`upgrade`&&(e.beginPath(),e.moveTo(n*.5,n*.04),e.lineTo(n*.94,n*.5),e.lineTo(n*.68,n*.5),e.lineTo(n*.68,n*.94),e.lineTo(n*.32,n*.94),e.lineTo(n*.32,n*.5),e.lineTo(n*.06,n*.5),e.closePath(),e.fill())}var Rp=class{constructor(e){let t=document.createElement(`canvas`);t.width=1024,t.height=1024,this.ctx=t.getContext(`2d`),this.tex=new Ii(t),this.tex.colorSpace=qe,this.tex.anisotropy=4,this.cells=new Map;let n=new fo(1,1);n.rotateX(-Math.PI/2),this.max=72,this.aCell=new hi(new Float32Array(this.max*2),2),this.aCell.setUsage($e),n.setAttribute(`aCell`,this.aCell);let r=new $r({map:this.tex,transparent:!0,depthWrite:!1});r.onBeforeCompile=e=>{e.vertexShader=`attribute vec2 aCell;
`+e.vertexShader.replace(`#include <uv_vertex>`,`#include <uv_vertex>
#ifdef USE_MAP
  vMapUv = uv * 0.125 + aCell;
#endif`)},this.mesh=new Ci(n,r,this.max),this.mesh.instanceColor=new hi(new Float32Array(this.max*3).fill(1),3),this.mesh.frustumCulled=!1,this.mesh.renderOrder=1,this.mesh.count=0,e.add(this.mesh),this.n=0,this._m=new un,this._c=new Gn;let i=new po(.52,.66,48,1);i.rotateX(-Math.PI/2),this.ringCount=i.index.count,this.ring=new di(i,new $r({color:16777215,transparent:!0,opacity:.95,depthWrite:!1})),this.ring.renderOrder=3,this.ring.visible=!1,e.add(this.ring);let a=new po(.52,.66,48,1);a.rotateX(-Math.PI/2),this.ringBg=new di(a,new $r({color:0,transparent:!0,opacity:.25,depthWrite:!1})),this.ringBg.renderOrder=2,this.ringBg.visible=!1,e.add(this.ringBg)}cell(e,t){let n=e+`:`+t,r=this.cells.get(n);if(r!==void 0)return r;r=this.cells.size%64,this.cells.set(n,r);let i=r%Pp,a=Math.floor(r/Pp),o=this.ctx;o.save(),o.translate(i*Fp,a*Fp),o.clearRect(0,0,Fp,Fp);let s=Ip[e]||`#888`;o.fillStyle=`rgba(0,0,0,0.28)`,Wf(o,8,12,112,112,24),o.fill(),o.fillStyle=s,Wf(o,8,6,112,112,24),o.fill(),o.lineWidth=7,o.strokeStyle=`#ffffff`,Wf(o,11,9,106,106,21),o.stroke();let c=Fp*.66;return o.translate(43.519999999999996/2,43.519999999999996/2-2),e===`crate`||e===`in`||e===`out`?(o.fillStyle=`rgba(255,255,255,0.92)`,o.beginPath(),o.arc(c/2,c/2,c*.5,0,Math.PI*2),o.fill(),o.lineJoin=`round`,e===`out`?Jf(o,t,c):Yf(o,t,c),e===`in`&&(o.fillStyle=s,o.beginPath(),o.moveTo(c*.78,c*.72),o.lineTo(c*1,c*.72),o.lineTo(c*.89,c*.92),o.fill())):Lp(o,e,c),o.restore(),this.tex.needsUpdate=!0,r}begin(){this.n=0}put(e,t,n,r,i,a=1){if(this.n>=this.max)return;let o=this.cell(r,i),s=o%Pp,c=Math.floor(o/Pp);this._m.makeScale(n,1,n),this._m.setPosition(e,.028,t),this.mesh.setMatrixAt(this.n,this._m),this.aCell.setXY(this.n,s/Pp,1-(c+1)/Pp),this._c.setRGB(a,a,a),this.mesh.setColorAt(this.n,this._c),this.n++}end(){this.mesh.count=this.n,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor.needsUpdate=!0,this.aCell.needsUpdate=!0}gauge(e,t,n){let r=n!=null;if(this.ring.visible=r,this.ringBg.visible=r,!r)return;this.ring.position.set(e,.05,t),this.ringBg.position.set(e,.045,t);let i=Math.max(0,Math.min(1,n));this.ring.geometry.setDrawRange(0,Math.max(0,Math.floor(this.ringCount/6*i))*6)}dispose(){this.mesh.geometry.dispose(),this.tex.dispose()}},zp=[],Bp=400;function Vp(e){zp.length>=Bp&&zp.shift(),zp.push({grav:-9,drag:.98,spin:0,rot:Math.random()*6,...e,life:e.life||1,t:0})}function Hp(e,t,n,r,i={}){let a=i.colors||[`#ffd23f`,`#ff5a7a`,`#4fb0ff`,`#6ee07a`,`#ffffff`,`#ff9a3c`];for(let o=0;o<r;o++){let r=Math.random()*Math.PI*2,o=(i.speed||4)*(.5+Math.random()*.7);Vp({type:i.type||`spark`,x:e,y:t,z:n,vx:Math.cos(r)*o*(i.spread??.6),vy:(i.up??5)*(.6+Math.random()*.6),vz:Math.sin(r)*o*(i.spread??.6),life:(i.life||1.1)*(.7+Math.random()*.6),size:(i.size||.12)*(.7+Math.random()*.6),color:id(a[Math.floor(Math.random()*a.length)]),grav:i.grav??-9,spin:(Math.random()-.5)*14})}}function Up(e,t,n=14,r=`#ffffff`,i=.4,a=3){for(let o=0;o<n;o++){let s=o/n*Math.PI*2;Vp({type:`puff`,x:e+Math.cos(s)*i,y:.15,z:t+Math.sin(s)*i,vx:Math.cos(s)*a,vy:.4,vz:Math.sin(s)*a,life:.55,size:.28,color:id(r),grav:0,drag:.9})}}function Wp(e,t,n,r=`#ffffff`,i=.25,a=3,o=1.2){for(let s=0;s<a;s++)Vp({type:`puff`,x:e+(Math.random()-.5)*.2,y:t,z:n+(Math.random()-.5)*.2,vx:(Math.random()-.5)*.4,vy:o*(.6+Math.random()*.6),vz:(Math.random()-.5)*.4,life:.9,size:i,color:id(r),grav:0,drag:.96})}function Gp(e,t){for(let n=zp.length-1;n>=0;n--){let r=zp[n];if(r.t+=e,r.t>=r.life){zp.splice(n,1);continue}r.vy+=r.grav*e;let i=r.drag**(e*60);r.vx*=i,r.vz*=i,r.x+=r.vx*e,r.y+=r.vy*e,r.z+=r.vz*e,r.y<.03&&r.type===`spark`&&(r.y=.03,r.vy*=-.3,r.vx*=.6,r.vz*=.6),r.rot+=r.spin*e;let a=r.t/r.life,o=r.size;o=r.type===`puff`?r.size*(.6+a*.9)*(1-a*a):r.size*(a>.7?(1-a)/.3:1),t.put(r.type,r.x,r.y,r.z,r.rot,o,r.color,r.rot*.7,0)}}function Kp(){zp.length=0}var qp=()=>document.getElementById(`world-ui`),Jp=[],Yp={x:0,y:0,vis:!1};function Xp(e,t,n,r,i=``,a=1.1){let o=document.createElement(`div`);o.className=`pop `+i,o.innerHTML=r,qp().appendChild(o),Jp.push({el:o,x:e,y:t,z:n,t:0,dur:a}),Jp.length>40&&Jp.shift().el.remove()}function Zp(e){for(let t=Jp.length-1;t>=0;t--){let n=Jp[t];if(n.t+=e,n.t>=n.dur){n.el.remove(),Jp.splice(t,1);continue}nd(n.x,n.y+n.t*1.1,n.z,Yp);let r=n.t/n.dur,i=r<.15?.5+r/.15*.7:r<.3?1.2-(r-.15)/.15*.2:1;n.el.style.transform=`translate(${Yp.x}px, ${Yp.y}px) translate(-50%, -50%) scale(${i})`;let a=Yp.y<(window.__hudBottom||0)?.3:1;n.el.style.opacity=String((r>.75?(1-r)/.25:1)*a)}}function Qp(){Jp.forEach(e=>e.el.remove()),Jp.length=0}var $p=[`#ff6b5a`,`#4fb0ff`,`#ffc83d`,`#6ee07a`,`#b58cff`,`#ff8fb8`,`#58c7b4`,`#ff9a3c`,`#8a9ab8`,`#e8e0d0`],em=[`#3a2a22`,`#1a1a1a`,`#8a5a2a`,`#d9a441`,`#6a3a8a`,`#c0392b`,`#e8e0d0`,`#4a6aa8`],tm=[`#ffd9b8`,`#f2c49b`,`#d9a077`,`#a8704a`,`#ffe4cc`],nm=new Gn(.62,.56,.46),rm=id(`#d6cfc0`),im=id(`#9a9a9a`),am=`#4a2a7a`,om=id(`#3a3f55`),sm=new un,cm=new un,lm=new zt,um=new bn,dm=new V,fm=new V(1,1,1),pm=new un,mm=new un,hm=new un().makeTranslation(0,.2,0).multiply(new un().makeRotationX(-1.3)).multiply(new un().makeTranslation(0,-.18,0));function gm(e,t){return e+Math.random()*(t-e)}function _m(e){return e[Math.floor(Math.random()*e.length)]}function vm(e){return e>=1?1:1-2**(-9*e)*Math.cos(e*Math.PI*3.2)}var ym=class{constructor(e,t){this.p=e,this.hooks=t,this.inst=new dd(U.scene),this.initInstances(),this.root=null,this.time=0,this.paused=!0,this.speed=1,this.chefMesh=sp({body:`#ffffff`,hat:e.cos.hat,apron:this.apronColor()}),U.scene.add(this.chefMesh),this.arrow=vp(),U.scene.add(this.arrow),this.padSys=new Rp(U.scene),this.padBorn=new Map,this.statics=[],this.staticMesh=null,this.camCut=null,this.gimmick={t:0,on:0},this.flights=[],this.customers=[],this.staff=[],this.anims=[],this.nextCustId=1,this.warnT={},this.stepT=0,this.stepAlt=!1}apronColor(){return(hf.find(e=>e.id===this.p.cos.apron)||hf[0]).color}refreshCostume(){cp(this.chefMesh,this.p.cos.hat),this.chefMesh.userData.apronMat.color.set(this.apronColor())}initInstances(){let e=this.inst;e.add(`plate`,ep(),700);for(let t of cf)e.add(`top_`+t,np(t),220);for(let t of Object.keys(lf))e.add(`ing_`+t,rp(t),160);e.add(`cash`,ip(),260),e.add(`coin`,ap(),120);let t=op();e.add(`c_body`,t.body,60),e.add(`c_head`,t.head,60),e.add(`c_hair`,t.hair,60),e.add(`c_face`,t.face,60,{shadow:!1}),e.add(`c_crown`,t.crown,8),e.add(`c_legs`,t.legs,60),e.add(`c_arm`,new W().add(G.cap(.055,.2,6),`#ffffff`,0,-.12,0).add(G.sph(.06,8,6),`#ffd9b8`,0,-.27,0).geometry(),24),e.add(`st_cap`,new W().add(new mo(.215,14,8,0,Math.PI*2,0,Math.PI*.45),`#ffffff`,0,.03,0).add(G.cyl(.13,.13,.02,12),`#ffffff`,0,.08,.17,.25,0,0,1,1,.8).geometry(),12),e.add(`stool_seat`,new W().add(G.cyl(.24,.24,.1,14),`#ffffff`,0,.52,0).geometry(),48),e.add(`stool_leg`,new W().add(G.cyl(.05,.07,.5,8),`#6a6f80`,0,.25,0).add(G.cyl(.2,.22,.04,12),`#6a6f80`,0,.02,0).geometry(),48),e.add(`spark`,new W().add(G.box(1,.35,.7),`#ffffff`).geometry(),300,{shadow:!1}),e.add(`puff`,new W().add(G.sph(.5,8,6),`#ffffff`).geometry(),200,{shadow:!1});let n=pd(64,64,e=>{let t=e.createRadialGradient(32,32,4,32,32,31);t.addColorStop(0,`rgba(0,0,0,0.42)`),t.addColorStop(.6,`rgba(0,0,0,0.25)`),t.addColorStop(1,`rgba(0,0,0,0)`),e.fillStyle=t,e.fillRect(0,0,64,64)}),r=new fo(1,1);r.rotateX(-Math.PI/2),e.add(`blob`,r,80,{shadow:!1,mat:new $r({map:n,transparent:!0,depthWrite:!1})})}loadStage(){let e=this.p,t=df[e.stage];this.stage=t,this.lay=Mf(t),this.theme=yp(t,e.cos.skin);let n=e.run;this.run=n,this.root&&this.disposeStage(),Kp(),Qp(),this.hooks.clearWorldUI&&this.hooks.clearWorldUI(),this.flights=[],this.customers=[],this.staff=[],this.anims=[],this.statics=[],this.padBorn=new Map,this.camCut=null,this.gimmick={t:0,on:0};let r=new Rn;this.root=r,U.scene.add(r);let i=this.lay,a=this.theme;U.hemi.color.set(a.hemiSky),U.hemi.groundColor.set(a.hemiGround),U.hemi.intensity=a.hemi,U.sun.color.set(a.light),U.sun.intensity=a.sun,this.env=Tp(t,i,a),r.add(this.env),this.decor=kp(t,i,a),r.add(this.decor.mesh),this.decor.glowMesh&&r.add(this.decor.glowMesh),this.fac=Op(t,i,a);let o=new Set(n.done);this.done=o;let s=e=>t.unlocks.some(t=>o.has(t.id)&&e(t));this.ext=s(e=>e.t===`extend`);let c=this.ext?t.layout.len1:t.layout.len0;this.belts=i.belts.map((e,t)=>{let n=new Pf(e,c);return n.built=t===0||s(e=>e.t===`lever`),n});for(let e of this.belts){let t=n.belts[e.id];Array.isArray(t)&&t.forEach((t,n)=>{t&&sf[t.m]&&n<e.slots.length&&(e.slots[n].item={m:t.m,laps:t.l||0,dried:!!t.d})}),e.built&&this.buildBeltVisual(e)}this.stations={};for(let e of i.stations){let r=t.start.menus.includes(e.menu)||s(t=>t.t===`station`&&t.menu===e.menu),i=n.st[e.menu]||{},a=n.cr[e.menu];this.stations[e.menu]={...e,built:r,inp:Math.max(0,Math.min(X.station.inCap,i.i|0)),out:Math.max(0,Math.min(X.station.outCap,i.o|0)),incoming:0,t:0,crateN:Number.isFinite(a)?Math.max(0,Math.min(X.crate.max,a)):X.crate.max,crateT:0,mesh:this.fac.stations[e.menu],crateMesh:this.fac.crates[e.menu]},r&&this.addStatic(this.fac.stations[e.menu],this.fac.crates[e.menu])}this.addStatic(this.fac.rack),this.sink={...i.sink,built:s(e=>e.t===`sink`),q:Math.max(0,n.sinkQ|0),t:0},this.sink.built&&this.addStatic(this.fac.sink),this.upgradeBuilt=s(e=>e.t===`upgrade`),this.upgradeBuilt&&this.addStatic(this.fac.desk),this.belts.forEach((e,t)=>{e.feed=i.feeds[t],e.trash=i.trashes[t],e.trashS=e.nearestS(e.trash.x,e.trash.z),e.built&&this.addStatic(this.fac.trash[t])}),this.lay.lever&&this.belts[1]?.built&&this.addStatic(this.fac.lever),this.seats=[];let l=[...t.start.seats];for(let e of t.unlocks)e.seats&&l.push(...e.seats);for(let e of l){let r=this.belts.find(t=>t.id===e[0]),i=t.start.seats.includes(e)||t.unlocks.some(t=>t.seats&&t.seats.includes(e)&&o.has(t.id)),a=n.seats[e]||{},s={id:e,belt:r,unlocked:i,cust:null,dirty:Math.max(0,a.d|0),money:Math.max(0,+a.m||0),stool:null,reserved:!1};this.placeSeat(s),s.born=-10,this.seats.push(s)}this.applyUpgrades();let u=this.countPlatesUsed();this.rack={...i.rack,n:Math.max(0,this.platesTotal()-u)};let d=(n.stack||[]).filter(e=>this.validItem(e)).slice(0,this.chefCap());this.chef={isChef:!0,x:i.belts[0].cx+(this.lay.m||1)*.001,z:i.topZ-i.r-2.6,ry:Math.PI,stack:d,incoming:0,lean:{x:0,z:0,vx:0,vz:0},pv:{x:0,z:0},zone:null,zoneT:0,xferT:0,moving:!1,walkT:0,mesh:this.chefMesh},t.unlocks.filter(e=>e.t===`staff`&&o.has(e.id)).map(e=>e.role).forEach((e,t)=>{let r=n.staff[t];this.spawnStaff(e,r&&Array.isArray(r.stack)?r.stack.filter(e=>this.validItem(e)):[],!1)}),this.pads=[],this.refreshPads(!1),this.rebuildNav(),this.rebuildZones();for(let e of this.zones)this.padBorn.set(this.padKey(e),-10);this.rebuildStatic(),this.spawnT=n.cust===0?X.cust.firstDelay:2,this.rushT=n.rushT||0,this.rush=null,this.combo=n.combo||0,this.lastComboT=0,td(0,this.chef.x,this.chef.z-.5,!0),J.setStyle(t.theme),J.setRush(!1),this.hooks.stageLoaded&&this.hooks.stageLoaded()}validItem(e){return!e||typeof e!=`object`?!1:e.k===`ing`?!!lf[e.id]:e.k===`dish`?!!sf[e.m]:e.k===`dirty`}platesTotal(){let e=this.seats?this.seats.filter(e=>e.unlocked).length:2;return X.plates+e*X.platesPerSeat+(this.run.upg.plates||0)*X.platesPerLvl}countPlatesUsed(){let e=this.sink.q;for(let t of Object.values(this.stations))e+=t.out;for(let t of this.belts)for(let n of t.slots)n.item&&e++;let t=e=>e.filter(e=>e.k===`dish`||e.k===`dirty`).length;e+=t(this.run.stack||[]);for(let n of this.run.staff||[])n&&Array.isArray(n.stack)&&(e+=t(n.stack));for(let t of this.seats)e+=t.dirty;return e}perk(e){return this.p.perks&&this.p.perks[e]||0}seasonMul(){return 1+((this.p.season||1)-1)*.5}applyUpgrades(){let e=this.run.upg;this.chefSpeed=X.chef.speed*(1+(e.speed||0)*X.chef.speedPerLvl),this.cookTime=X.station.cookTime*X.station.cookPerLvl**+(e.cook||0),this.beltSpeed=X.belt.speed+(e.belt||0)*X.belt.speedPerLvl,this.staffSpeed=X.staff.speed*(1+(e.sspeed||0)*X.staff.speedPerLvl),this.staffCap=X.staff.cap+(e.scap||0)*X.staff.capPerLvl}chefCap(){return X.chef.cap+(this.run.upg.cap||0)*X.chef.capPerLvl+this.perk(`cap`)}buildBeltVisual(e){e.group&&(this.root.remove(e.group),this.statics=this.statics.filter(t=>t!==e.group),e.group.traverse(e=>e.geometry&&e.geometry.dispose()));let t=zf(e,this.theme),n=new Rn,r=e.topZ+e.len/2;n.position.set(e.cx,0,r),t.position.set(-e.cx,0,-r),n.add(t),n.add(Ap(e,this.stage.theme,this.theme)),e.group=n,this.addStatic(n)}addStatic(...e){for(let t of e)t&&(t.parent||this.root.add(t),this.statics.includes(t)||this.statics.push(t))}rebuildStatic(){let e=new Set(this.anims.map(e=>e.obj)),t=[];this.root.updateMatrixWorld(!0);for(let n of this.statics){let r=e.has(n);n.traverse(e=>{e.isMesh&&e.material===Yu&&(e.visible=r,r||t.push(e.geometry.clone().applyMatrix4(e.matrixWorld)))})}if(this.staticMesh&&(this.root.remove(this.staticMesh),this.staticMesh.geometry.dispose(),this.staticMesh=null),!t.length)return;let n=qu(t,!1);t.forEach(e=>e.dispose());let r=new di(n,Yu);r.castShadow=!0,r.receiveShadow=!0,this.staticMesh=r,this.root.add(r)}disposeStage(){U.scene.remove(this.root);let e=new Set;if(this.root.traverse(t=>{t.geometry&&!e.has(t.geometry)&&(e.add(t.geometry),t.geometry.dispose());let n=t.material?Array.isArray(t.material)?t.material:[t.material]:[];for(let t of n)t===Yu||t===Xu||e.has(t)||(e.add(t),t.map&&!t.map.userData.shared&&t.map.dispose(),t.dispose())}),this.fac){let e=[...Object.values(this.fac.stations),...Object.values(this.fac.crates),this.fac.sink,this.fac.rack,this.fac.desk,this.fac.lever,...this.fac.trash];for(let t of e)t&&!t.parent&&t.traverse(e=>e.geometry&&e.geometry.dispose())}for(let e of this.pads||[])e.ui.dispose&&e.ui.dispose();this.staticMesh=null}padKey(e){return e.type+`:`+Math.round(e.x*10)+`:`+Math.round(e.z*10)}placeSeat(e){let t=Nf(e.id,e.belt,e.belt.len);Object.assign(e,t);let n=e.side===`R`?1:-1;e.out=n,e.zone={x:e.x+n*.5,z:e.z},e.stand={x:e.x+n*.55,z:e.z}}rebuildNav(){let e=this.lay,t=[];for(let e of this.belts)e.built&&t.push({t:`stad`,x:e.cx,z0:e.topZ,z1:e.topZ+e.len,rad:e.r+Af+.04});for(let e of Object.values(this.stations))e.built&&(t.push({t:`box`,x:e.x,z:e.z,hw:.82,hd:.58}),t.push({t:`box`,x:e.crate.x,z:e.crate.z,hw:.62,hd:.5}));t.push({t:`box`,x:e.rack.x,z:e.rack.z,hw:.62,hd:.47}),this.sink.built&&t.push({t:`box`,x:e.sink.x,z:e.sink.z,hw:.85,hd:.6}),this.upgradeBuilt&&t.push({t:`box`,x:e.upgrade.desk.x,z:e.upgrade.desk.z,hw:.66,hd:.86}),this.belts.forEach((n,r)=>{n.built&&t.push({t:`box`,x:e.trashes[r].bin.x,z:e.trashes[r].bin.z,hw:.38,hd:.38})}),e.lever&&this.belts[1]?.built&&t.push({t:`box`,x:e.lever.model.x,z:e.lever.model.z,hw:.28,hd:.28});for(let e of this.decor?.obs||[])t.push(e);this.nav||(this.nav=new jp(e.bounds)),this.nav.bounds=e.bounds,this.nav.setObstacles(t)}rebuildZones(){let e=[],t=(t,n,r,i,a)=>e.push({type:t,x:n,z:r,hw:i,hd:i,ref:a});for(let e of Object.values(this.stations))e.built&&(t(`crate`,e.crate.pad.x,e.crate.pad.z,.6,e),t(`in`,e.padIn.x,e.padIn.z,.6,e),t(`out`,e.padOut.x,e.padOut.z,.6,e));this.sink.built&&t(`sink`,this.sink.pad.x,this.sink.pad.z,.6,this.sink);for(let e of this.belts)e.built&&(t(`feed`,e.feed.x,e.feed.z,.62,e),t(`trash`,e.trash.x,e.trash.z,.6,e));this.upgradeBuilt&&t(`upgrade`,this.lay.upgrade.x,this.lay.upgrade.z,.62,null);for(let t of this.seats)t.unlocked&&e.push({type:`seat`,x:t.zone.x,z:t.zone.z,hw:.62,hd:.5,ref:t});for(let t of this.pads)e.push({type:`unlock`,x:t.x,z:t.z,hw:t.ui.size*.45,hd:t.ui.size*.45,ref:t});this.zones=e;for(let t of e)this.padBorn.has(this.padKey(t))||this.padBorn.set(this.padKey(t),this.time)}refreshPads(e=!0){let t=this.stage.unlocks.filter(e=>!this.done.has(e.id)).slice(0,2);for(let e of this.pads.slice())t.includes(e.u)||(this.root.remove(e.ui.mesh),this.pads.splice(this.pads.indexOf(e),1));for(let n of t){if(this.pads.some(e=>e.u===n))continue;let t=this.unlockPos(n),{label:r,icon:i}=this.unlockLabel(n),a=n.t===`next`||n.t===`final`?`next`:`unlock`,o=new Sp(r,i,n.cost,t.x,t.z,a),s={u:n,x:t.x,z:t.z,ui:o,paid:Math.min(n.cost,this.run.paid[n.id]||0),payT:0,coinT:0};o.draw(s.paid,this.run.money>0),this.root.add(o.mesh),this.pads.push(s),e&&this.popIn(o.mesh,.25,o.size)}}unlockPos(e){let t=this.lay;switch(e.t){case`seats`:{let t=this.seats?this.seats.find(t=>t.id===e.seats[0]):null,n=this.seats?this.seats.find(t=>t.id===e.seats[1]):null;return t&&n&&t.side===n.side&&t.belt===n.belt?{x:t.x+t.out*.35,z:(t.z+n.z)/2}:t?{x:t.x+t.out*.35,z:t.z}:{x:0,z:0}}case`station`:{let n=t.stations.find(t=>t.menu===e.menu);return{x:n.x,z:n.z+1.05}}case`sink`:return{x:t.sink.pad.x,z:t.sink.pad.z};case`upgrade`:return{x:t.upgrade.x,z:t.upgrade.z};case`staff`:return e.role===`runner`?{x:t.upgrade.x,z:t.upgrade.z-2.1}:{x:t.upgrade.x-2.1*t.m,z:t.upgrade.z};case`extend`:return{x:t.extPad.x,z:t.extPad.z};case`lever`:return{x:t.lever.x,z:t.lever.z};default:return{x:t.nextPad.x,z:t.nextPad.z}}}unlockLabel(e){switch(e.t){case`seats`:return{label:`좌석 +`+e.seats.length,icon:{glyph:`seat`}};case`station`:return{label:sf[e.menu].name.replace(` 초밥`,``),icon:{menu:e.menu}};case`sink`:return{label:`설거지대`,icon:{glyph:`sink`}};case`upgrade`:return{label:`업그레이드`,icon:{glyph:`upgrade`}};case`staff`:return e.role===`runner`?{label:`운반 직원`,icon:{glyph:`staff`}}:{label:`조리 직원`,icon:{glyph:`hauler`}};case`extend`:return{label:`벨트 확장`,icon:{glyph:`belt`}};case`lever`:return{label:`분기 레버`,icon:{glyph:`lever`}};case`final`:return{label:`우주 최고`,icon:{glyph:`final`}};default:return{label:`새 식당 이전`,icon:{glyph:`next`}}}}popIn(e,t=0,n=1){let r=e.scale.clone();n!==1&&r.set(n,1,n),e.scale.set(.001,.001,.001),this.anims.push({obj:e,t:-t,dur:.7,base:r})}doUnlock(e){let t=e.u,n=this.lay;this.done.add(t.id),this.run.done.push(t.id),delete this.run.paid[t.id];let r=[],i={x:e.x,z:e.z};switch(t.t){case`seats`:for(let e of t.seats){let t=this.seats.find(t=>t.id===e);t&&(t.unlocked=!0,t.born=this.time,this.rack.n+=X.platesPerSeat)}break;case`station`:{let e=this.stations[t.menu];e.built=!0,e.inp=4,e.out=0,this.addStatic(e.mesh,e.crateMesh),r.push(e.mesh,e.crateMesh),this.hooks.discover&&this.hooks.discover(t.menu),i={x:e.x,z:e.z};break}case`sink`:this.sink.built=!0,this.addStatic(this.fac.sink),r.push(this.fac.sink),i={x:n.sink.x,z:n.sink.z};break;case`upgrade`:this.upgradeBuilt=!0,this.addStatic(this.fac.desk),r.push(this.fac.desk);break;case`staff`:{let n=this.spawnStaff(t.role,[],!0);n.x=e.x,n.z=e.z,n.born=this.time,this.hooks.stat(`staff`,1),i={x:e.x,z:e.z};break}case`extend`:this.ext=!0;for(let e of this.belts)e.setLen(this.stage.layout.len1),e.trashS=e.nearestS(e.trash.x,e.trash.z),e.built&&(this.buildBeltVisual(e),r.push(e.group));for(let e of this.seats)this.placeSeat(e);i={x:this.belts[0].cx,z:this.belts[0].topZ+this.belts[0].len/2};break;case`lever`:{let e=this.belts[1];e.built=!0,this.buildBeltVisual(e),this.addStatic(this.fac.lever,this.fac.trash[1]),r.push(e.group,this.fac.lever,this.fac.trash[1]);for(let e of t.seats||[]){let t=this.seats.find(t=>t.id===e);t&&(t.unlocked=!0,t.born=this.time,this.rack.n+=X.platesPerSeat)}i={x:e.cx,z:e.topZ+e.len/2};break}}if(r.forEach((e,t)=>this.popIn(e,.3+t*.06)),this.rebuildStatic(),t.t!==`next`&&t.t!==`final`&&(this.camCut={x:i.x,z:i.z,t:0,dur:1.3}),this.unlockFx={x:i.x,z:i.z,t:.3},Hp(e.x,.4,e.z,20,{up:5,speed:3}),U.shake=.55,J.duck(.9),J.play(`unlock`),this.hooks.haptic(40),this.hooks.stat(`unlocks`,1),Xp(i.x,2.2,i.z,`NEW!`,`pop-new`,1.4),this.rebuildNav(),t.t===`next`||t.t===`final`){t.t===`final`&&(this.refreshPads(!1),this.rebuildZones()),this.hooks.stageClear(t.t===`final`);return}this.refreshPads(!0),this.rebuildZones(),this.hooks.unlocked&&this.hooks.unlocked(t),this.hooks.save()}spawnStaff(e,t,n){let r=this.lay.idle[e],i={role:e,x:r.x+gm(-.4,.4),z:r.z+gm(-.3,.3),ry:0,stack:t.slice(0,8),incoming:0,lean:{x:0,z:0,vx:0,vz:0},pv:{x:0,z:0},zone:null,zoneT:0,xferT:0,moving:!1,walkT:Math.random()*3,mesh:null,shirt:id(e===`runner`?`#4fb0ff`:`#6ee07a`),capC:id(e===`runner`?`#2f6fd8`:`#2f9e5a`),skin:id(_m(tm)),born:-10,path:[],goal:null,task:null,wait:0,think:0};return this.staff.push(i),i}update(e){this.time+=e,this.run.time+=e,this.updateChef(e);for(let t of this.staff)this.updateStaff(t,e);this.updateStations(e),this.updateBelts(e),this.updateCustomers(e),this.updateFlights(e),this.updateRush(e),this.updateGimmick(e);let t=this.bneck=this.bneck||{rack:0,full:0,cook:0,wait:0},n=Math.exp(-e/40);for(let e in t)t[e]*=n;this.rack.n===0&&(t.rack+=e),this.chef.stack.length>=this.chefCap()&&(t.full+=e),Object.values(this.stations).some(e=>e.built&&e.inp>0&&e.out===0)&&(t.cook+=e*.5),this.customers.some(e=>e.state===`wait`&&e.wait>15)&&(t.wait+=e*.5),this.updateAnims(e),this.updateGuide(e)}updateChef(e){let t=this.chef,n=bd(),r=this.chefSpeed,i=n.dx*r,a=n.dy*r,o=Math.hypot(i,a)>.05,s=t.x,c=t.z;t.x+=i*e,t.z+=a*e,this.nav.collide(t,X.chef.radius);let l=Math.hypot(i,a)*e;if(l>1e-4){let n=Math.hypot(t.x-s,t.z-c);if(n<l*.25){let r=null;for(let t of[1,-1]){let n=t*1.1,o=i*Math.cos(n)-a*Math.sin(n),l=i*Math.sin(n)+a*Math.cos(n),u={x:s+o*e*.8,z:c+l*e*.8};this.nav.collide(u,X.chef.radius);let d=Math.hypot(u.x-s,u.z-c);(!r||d>r.d)&&(r={d,q:u})}r&&r.d>n+1e-4&&(t.x=r.q.x,t.z=r.q.z)}}if(o){let i=Math.atan2(n.dx,n.dy)-t.ry;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;t.ry+=i*Math.min(1,e*14),t.walkT+=e,this.stepT-=r/3.4*e,this.stepT<=0&&(this.stepT=.27,this.stepAlt=!this.stepAlt,J.play(`step`,+!!this.stepAlt),Math.random()<.35&&Wp(t.x,.05,t.z,`#ffffff`,.12,1,.4))}t.moving=o,this.updateLean(t,e,(t.x-s)/Math.max(e,1e-4),(t.z-c)/Math.max(e,1e-4)),this.actorZones(t,e)}updateLean(e,t,n,r){let i=(n-e.pv.x)/Math.max(t,1e-4),a=(r-e.pv.z)/Math.max(t,1e-4);e.pv.x=n,e.pv.z=r;let o=Math.max(-.5,Math.min(.5,-i*.012)),s=Math.max(-.5,Math.min(.5,-a*.012)),c=e.lean;c.vx+=((o-c.x)*60-c.vx*7)*t,c.vz+=((s-c.z)*60-c.vz*7)*t,c.x+=c.vx*t,c.z+=c.vz*t}findZone(e){for(let t of this.zones)if(Math.abs(e.x-t.x)<t.hw&&Math.abs(e.z-t.z)<t.hd){if(!e.isChef&&(t.type===`unlock`||t.type===`upgrade`))continue;return t}return null}actorZones(e,t){let n=this.findZone(e);if(n!==e.zone&&(e.zone&&e.isChef&&e.zone.type===`upgrade`&&this.hooks.closeUpgrade&&this.hooks.closeUpgrade(),e.zone=n,e.zoneT=0,e.xferT=.05,e.upgOpened=!1),!n)return;if(e.zoneT+=t,n.type===`unlock`){e.isChef&&this.payPad(n.ref,t);return}if(n.type===`upgrade`){e.isChef&&!e.upgOpened&&(!e.moving&&e.zoneT>.15||e.zoneT>.8)&&(e.upgOpened=!0,this.hooks.openUpgrade());return}if(e.isChef&&n.type===`seat`&&n.ref.money>0){e.billT=(e.billT||0)-t;let r=0;for(;e.billT<=0&&n.ref.money>0&&r++<4;)e.billT+=X.billTick,this.takeBill(n.ref,e);return}e.xferT-=t;let r=0;for(;e.xferT<=0&&r++<4;)if(this.transfer(e,n))e.lastXfer=this.time,e.xferT+=n.type===`crate`||n.type===`feed`||n.type===`out`?X.fastTransfer:X.transfer;else{e.xferT=.05;break}}billUnit(){return 5*this.stage.priceMul*this.seasonMul()}billCount(e){return e.money<=0?0:Math.min(30,Math.max(1,Math.ceil(e.money/this.billUnit()-.001)))}takeBill(e,t){let n=this.billCount(e);e.collecting||(e.collecting=!0,Xp(e.cx,1.6,e.cz,`+`+wp(e.money),`pop-money`,1),this.hooks.haptic(15));let r=n<=1?e.money:Math.max(1,Math.floor(e.money/n));e.money=Math.max(0,e.money-r),e.money<1&&(e.money=0,e.collecting=!1,this.hooks.tut&&this.hooks.tut(`money`)),this.addMoney(r);let i=Math.floor((n-1)/3);this.fly({k:`cash`},{x:e.cx+((n-1)%3-1)*.16,y:Uf+i*.07,z:e.cz+.22*(e.side===`R`?1:-1)},()=>({x:t.x,y:1.1,z:t.z}),()=>J.play(`coin`),null,.24,1),t.lastXfer=this.time}room(e){return(e.isChef?this.chefCap():this.staffCap)-e.stack.length-e.incoming}stackTopPos(e,t={}){let n=0;for(let t of e.stack)n+=($f[t.k]||.2)*1.22;let r=e.isChef?.42:.36,i=Math.sin(e.ry)*r,a=Math.cos(e.ry)*r;return t.x=e.x+i+e.lean.x*n*.6,t.y=(e.isChef?.74:.6)+n,t.z=e.z+a+e.lean.z*n*.6,t}transfer(e,t){let n=t.ref;switch(t.type){case`crate`:{if(n.crateN<1||this.room(e)<=0)return!1;n.crateN--;let t={k:`ing`,id:n.ing};return this.fly(t,{x:n.crate.x+gm(-.2,.2),y:.6,z:n.crate.z},()=>this.stackTopPos(e),()=>this.pushStack(e,t),e),!0}case`in`:{if(n.inp+n.incoming>=X.station.inCap)return e.isChef&&this.warn(`full_`+n.menu,`조리대 재료가 가득 찼어요`,n.x,n.z),!1;let t=this.findTop(e.stack,e=>e.k===`ing`&&e.id===n.ing);if(t<0)return!1;let[r]=e.stack.splice(t,1);n.incoming++;let i=this.stackTopPos(e);return this.fly(r,i,{x:n.x-.42,y:1+n.inp*.12,z:n.z},()=>{n.incoming--,n.inp++,J.play(`drop`,n.inp)}),e.isChef&&this.hooks.tut&&this.hooks.tut(`deposit`),!0}case`out`:{if(n.out<1||this.room(e)<=0)return!1;n.out--;let t={k:`dish`,m:n.menu};return this.fly(t,{x:n.x+.42,y:1+n.out*.2,z:n.z},()=>this.stackTopPos(e),()=>this.pushStack(e,t),e),!0}case`sink`:{let t=this.findTop(e.stack,e=>e.k===`dirty`);if(t<0)return!1;let[r]=e.stack.splice(t,1);return this.fly(r,this.stackTopPos(e),{x:n.x-.35,y:1+Math.min(n.q,12)*.07,z:n.z},()=>{n.q++,J.play(`clack`)}),!0}case`feed`:{let t=this.findTop(e.stack,e=>e.k===`dish`);if(t<0)return e.isChef?this.recoverDish(e,n):!1;let r=n,i=null,a=1e9;for(let e of r.slots){if(e.item||e.res)continue;let t=r.dist(r.slotS(e),r.feedS);t<1.35&&t<a&&(a=t,i=e)}if(!i)return r.free()===0&&e.isChef&&this.warn(`beltfull`,`벨트가 꽉 찼어요! 손님이 원하는 메뉴만 올려요`,r.feed.x,r.feed.z,`bad`),!1;let[o]=e.stack.splice(t,1);i.res=!0;let s=this.stackTopPos(e);return this.fly(o,s,()=>{let e=r.point(r.slotS(i));return{x:e.x,y:Uf+.02,z:e.z}},()=>{i.res=!1,i.item={m:o.m,laps:0,dried:!1},J.play(`clack`),this.checkSet(r,i),e.isChef&&this.hooks.tut&&this.hooks.tut(`feed`)},null,.22),!0}case`trash`:{let t=n;if(this.room(e)<=0)return!1;let r=null;for(let e of t.slots)if(e.item&&e.item.dried&&!e.res&&t.dist(t.slotS(e),t.trashS)<.55){r=e;break}if(!r)return!1;let i=t.point(t.slotS(r));r.item=null;let a={k:`dirty`};return Wp(i.x,1,i.z,`#b8a888`,.2,3),J.play(`dry`),this.hooks.stat(`dried`,1),this.fly(a,{x:i.x,y:Uf+.05,z:i.z},()=>this.stackTopPos(e),()=>this.pushStack(e,a),e),!0}case`seat`:{let t=n,r=t.cust&&t.cust.state!==`leave`;if(t.dirty>0&&!r&&this.room(e)>0){t.dirty--;let n={k:`dirty`};return this.fly(n,{x:t.cx,y:Uf+t.dirty*.07,z:t.cz},()=>this.stackTopPos(e),()=>this.pushStack(e,n),e),!0}return!1}}return!1}checkSet(e,t){let n=e.slots.length,r=r=>e.slots[(t.i+r+n)%n].item,i=t.item.m;for(let[n,a]of[[-2,-1],[-1,1],[1,2]]){let o=r(n),s=r(a);if(o&&s&&o.m===i&&s.m===i&&!o.dried&&!s.dried&&!(o.bonus&&s.bonus&&t.item.bonus)){o.bonus=s.bonus=t.item.bonus=!0;let n=e.point(e.slotS(t));Xp(n.x,1.8,n.z,`3연속 세트!<small>팁 +30%</small>`,`pop-combo`,1.2),Hp(n.x,1,n.z,14,{colors:[`#ffd23f`,`#ffffff`],up:4,speed:2}),J.play(`combo`,4),this.hooks.stat(`sets`,1);return}}}recoverDish(e,t){if(e.moving||e.zoneT<.8||this.room(e)<=0)return!1;let n=this.demand();for(let r of t.slots){let i=r.item;if(!i||i.dried||r.res||t.dist(t.slotS(r),t.feedS)>.6||(n[i.m]||0)>=0)continue;r.item=null;let a=t.point(t.slotS(r)),o={k:`dish`,m:i.m};return this.fly(o,{x:a.x,y:Uf+.05,z:a.z},()=>this.stackTopPos(e),()=>this.pushStack(e,o),e),this.warn(`recover`,`남는 접시를 벨트에서 다시 챙겼어요`,a.x,a.z),!0}return!1}findTop(e,t){for(let n=e.length-1;n>=0;n--)if(t(e[n]))return n;return-1}pushStack(e,t){e.stack.push(t),e.bump=1,e.isChef&&(J.play(`pick`,e.stack.length),this.hooks.haptic(8),t.k===`ing`&&this.hooks.tut&&this.hooks.tut(`pick`),t.k===`dish`&&this.hooks.tut&&this.hooks.tut(`dish`))}collectMoney(e,t){let n=Math.floor(e.money);if(e.money=0,n<=0)return;this.addMoney(n);let r=Math.min(10,2+Math.floor(Math.log2(n+1)));for(let n=0;n<r;n++)this.fly({k:`coin`},{x:e.cx+gm(-.15,.15),y:Uf+.1,z:e.cz+gm(-.15,.15)},()=>({x:t.x,y:1.1,z:t.z}),()=>{J.play(`coin`)},null,.32+n*.045,1.4);Xp(e.cx,1.6,e.cz,`+`+wp(n),`pop-money`,1),this.hooks.haptic(15),this.hooks.tut&&this.hooks.tut(`money`)}addMoney(e){this.run.money+=e,this.run.earned+=e,this.hooks.stat(`earned`,e),this.hooks.money&&this.hooks.money(e)}payPad(e,t){let n=this.chef;if(n.zoneT<.2)return;let r=e.u;if(this.run.money<=0){if(e.paid<r.cost&&(this.p.tut||0)>=6){let t=this.seats.some(e=>e.money>0);this.warn(`nomoney`,t?`돈이 부족해요. 손님 자리의 돈을 챙겨요`:`돈이 부족해요. 초밥을 더 팔아 돈을 모아요`,e.x,e.z)}return}e.payT+=t;let i=.035;for(;e.payT>=i;){e.payT-=i;let t=Math.max(1,Math.ceil(r.cost/(X.unlockTime/i))),a=Math.min(t,Math.floor(this.run.money),r.cost-e.paid);if(a<=0)break;if(this.run.money-=a,e.paid+=a,this.run.paid[r.id]=e.paid,e.coinT-=i,e.coinT<=0&&(e.coinT=.07,J.play(`pay`),this.fly({k:`coin`},{x:n.x,y:1.2,z:n.z},{x:e.x+gm(-.3,.3),y:.05,z:e.z+gm(-.3,.3)},null,null,.28,1.2)),e.paid>=r.cost){this.hooks.money&&this.hooks.money(0),this.doUnlock(e);return}}e.ui.draw(e.paid,!0),this.hooks.money&&this.hooks.money(0)}warn(e,t,n,r,i=``){let a=this.warnT[e]||0;this.time-a<4||(this.warnT[e]=this.time,this.hooks.toast(t,i),i===`bad`&&J.play(`error`))}fly(e,t,n,r,i=null,a=.26,o=.9){i&&i.incoming++,this.flights.push({it:e,from:{...t},to:n,done:r,actor:i,t:0,dur:a,h:o,ry:gm(0,6)})}updateFlights(e){for(let t=this.flights.length-1;t>=0;t--){let n=this.flights[t];n.t+=e,n.t>=n.dur&&(this.flights.splice(t,1),n.actor&&n.actor.incoming--,n.done&&n.done())}}updateStations(e){for(let t of Object.values(this.stations))if(t.built){if(t.crateN<X.crate.max&&(t.crateT+=e,t.crateT>=X.crate.regen&&(t.crateT=0,t.crateN++)),t.inp>0&&t.out<X.station.outCap&&this.rack.n>0){let n=this.staff.some(e=>e.role===`hauler`)?1.15:1;t.t+=e*n,Math.random()<e*4&&Wp(t.x-.3+gm(-.2,.2),1.1,t.z,`#ffffff`,.14,1,1),t.t>=this.cookTime&&(t.t=0,t.inp--,this.rack.n--,t.out++,J.play(`cook`),this.hooks.discover&&this.hooks.discover(t.menu),Wp(t.x+.42,1.2,t.z,`#fff6d0`,.18,3,1.4))}else t.inp>0&&this.rack.n<=0&&(t.t=Math.min(t.t,this.cookTime*.95))}this.sink.built&&this.sink.q>0&&(this.sink.t+=e,Math.random()<e*6&&Wp(this.sink.x+.2,1,this.sink.z,`#bfeaff`,.15,1,.8),this.sink.t>=X.sink.washTime&&(this.sink.t=0,this.sink.q--,this.rack.n++,J.play(`wash`),this.hooks.stat(`washed`,1)))}updateBelts(e){let t=0;for(let n of this.belts){if(!n.built)continue;n.update(e,this.beltSpeed*this.waveMul(),e=>{if(e.item.laps++,!e.item.dried&&e.item.laps>=(this.stage.theme===`space`?5:X.belt.dryLaps)){e.item.dried=!0;let t=n.point(n.slotS(e));Wp(t.x,1,t.z,`#a89a70`,.2,4,.8),J.play(`dry`),this.warn(`dried`,`접시가 말라버렸어요! 수거함 발판에서 치워요`,t.x,t.z)}});let r=Math.hypot(this.chef.x-n.cx,this.chef.z-(n.topZ+n.len/2));t=Math.max(t,Math.max(0,1-r/9))}Hf(e,this.beltSpeed*this.waveMul()),J.beltLevel(t)}waveMul(){return this.gimmick.on>0&&this.stage.theme===`beach`?1.7:1}updateGimmick(e){let t=this.gimmick,n=this.stage.theme;if(t.t+=e,t.on>0){if(t.on-=e,n===`beach`&&Math.random()<e*8){let e=this.belts[Math.floor(Math.random()*this.belts.length)];if(e.built){let t=e.point(Math.random()*e.L);Wp(t.x,Uf+.1,t.z,`#bff4ff`,.2,2,1.2)}}t.on<=0&&n===`beach`&&this.hooks.toast(`파도가 잔잔해졌어요`)}let r=this.env?.userData.water;if(r&&(r.position.y=-.25+(t.on>0&&n===`beach`?Math.sin(this.time*3)*.12:Math.sin(this.time*.8)*.03)),!(this.done.size<1)){if(n===`beach`&&t.t>45)t.t=0,t.on=7,this.hooks.banner(`큰 파도!`,`7초 동안 벨트가 빨라져요`,null),J.play(`whoosh`),U.shake=.3;else if(n===`mall`&&t.t>50){let e=this.freeSeats();if(!e.length)return;t.t=0;let n=Math.min(3,e.length);e.sort(()=>Math.random()-.5);let r=this.lay.escalator;for(let t=0;t<n;t++){let n=this.spawnCustomer(e[t],{});n&&r&&(n.x=r.x+gm(-.2,.2),n.z=r.z-t*.7,n.path=this.nav.path(n.x,n.z,e[t].stand.x,e[t].stand.z))}this.hooks.banner(`에스컬레이터 손님!`,`${n}명이 한꺼번에 올라와요`,null),J.play(`pop`)}}}driedCount(e){let t=0;for(let n of e.slots)n.item&&n.item.dried&&t++;return t}stars(){let e=this.run.hist,t=e.reduce((e,t)=>e+t,0)/e.length;return Math.max(1,Math.min(5,1+t*4))}satisfaction(){let e=this.run.hist;return e.reduce((e,t)=>e+t,0)/e.length}builtMenus(){return Object.values(this.stations).filter(e=>e.built).map(e=>e.menu)}freeSeats(){return this.seats.filter(e=>e.unlocked&&!e.cust&&e.dirty===0&&!e.reserved)}spawnInterval(){let e=Math.max(3.5,this.stars()),t=Math.max(2,this.seats.filter(e=>e.unlocked).length),n=X.cust.seatCycle/t/this.stage.cust*(1.5-(e-1)/4*.8);return n=Math.max(1.2,n),this.rush&&this.rush.t>0&&(n*=.45),n}queueSpot(e){let t=this.lay;return{x:t.door.x+1.5,z:t.door.z-1-e*.85}}updateCustomers(e){let t=this.customers.filter(e=>e.state===`toQueue`||e.state===`queue`);if(t.length){let e=this.freeSeats();if(e.length){let n=t[0],r=_m(e);n.seat=r,r.reserved=!0,n.state=`enter`,n.path=this.nav.path(n.x,n.z,r.stand.x,r.stand.z)}}if(this.spawnT-=e,this.spawnT<=0){let e=this.freeSeats(),t=this.customers.filter(e=>e.state===`toQueue`||e.state===`queue`).length;e.length&&!t?(this.spawnCustomer(_m(e),{}),this.spawnT=this.spawnInterval()*gm(.75,1.25)):!e.length&&t<3&&this.run.cust>4?(this.spawnCustomer(null,{}),this.spawnT=this.spawnInterval()*gm(1.2,1.8),t===2&&this.warn(`queue`,`손님이 줄을 섰어요! 좌석을 늘리거나 빨리 치워요`,0,0)):this.spawnT=1}for(let t=this.customers.length-1;t>=0;t--){let n=this.customers[t];this.updateCustomer(n,e),n.state===`gone`&&(this.customers.splice(t,1),this.hooks.custGone&&this.hooks.custGone(n))}}spawnCustomer(e,t){let n=this.builtMenus();if(!n.length)return null;e&&(e.reserved=!0);let r=this.lay,i;if(!t.vip&&!t.group&&this.stage.theme===`ryokan`&&n.length>=2&&this.run.cust>3&&Math.random()<.3&&(t.omakase=!0),t.vip||t.omakase){let e=n.slice().sort(()=>Math.random()-.5);i=[0,1,2].map(t=>e[t%e.length])}else if(t.group)i=Array(t.n||2).fill(t.menu);else{let e=Math.random(),t=this.run.cust<2||e<.42?1:e<.84?2:3;i=[];for(let e=0;e<t;e++)i.push(_m(n))}let a={id:this.nextCustId++,seat:e,x:r.door.x+gm(-.6,.6),z:r.door.z+2.2,ry:Math.PI,state:`enter`,path:[],orders:i,oi:0,wait:0,waits:[],pat:X.cust.patience*(t.vip||t.omakase?1.6:1)*(1+this.perk(`patience`)*.08),patMax:X.cust.patience*(t.vip||t.omakase?1.6:1)*(1+this.perk(`patience`)*.08),omakase:!!t.omakase,eatT:0,bill:0,vip:!!t.vip,group:!!t.group,shirt:id(t.vip?am:t.shirt||_m($p)),hair:id(_m(em)),skin:id(_m(tm)),pants:id(_m([`#3a3f55`,`#5a4a3a`,`#2a4a6a`,`#4a4a4a`])),walkT:Math.random()*5,sitT:0,dish:null,emote:null,bob:0,scale:t.vip?1.08:gm(.92,1.05)};if(e)a.path=[{x:r.door.x,z:r.door.z-.6},...this.nav.path(r.door.x,r.door.z-.6,e.stand.x,e.stand.z)];else{a.state=`toQueue`,a.qPat=28;let e=this.customers.filter(e=>e.state===`toQueue`||e.state===`queue`).length,t=this.queueSpot(e);a.path=[{x:r.door.x,z:r.door.z-.6},t]}return this.customers.push(a),this.run.cust++,a}walk(e,t,n){if(!e.path.length)return!0;let r=e.path[0],i=r.x-e.x,a=r.z-e.z,o=Math.hypot(i,a),s=n*t;if(o<=s?(e.x=r.x,e.z=r.z,e.path.shift()):(e.x+=i/o*s,e.z+=a/o*s),o>.01){let n=Math.atan2(i,a)-e.ry;for(;n>Math.PI;)n-=Math.PI*2;for(;n<-Math.PI;)n+=Math.PI*2;e.ry+=n*Math.min(1,t*12)}return e.walkT+=t,e.path.length===0}updateCustomer(e,t){let n=e.seat;switch(e.state){case`toQueue`:case`queue`:{e.qPat-=t;let n=this.customers.filter(e=>e.state===`toQueue`||e.state===`queue`).indexOf(e),r=this.queueSpot(Math.max(0,n));if(e.state===`queue`&&(e.path=Math.hypot(r.x-e.x,r.z-e.z)>.05?[r]:[]),this.walk(e,t,X.cust.walk)&&(e.state=`queue`,e.ry=Math.PI),e.qPat<=0){let t=this.lay;e.state=`leave`,e.path=[{x:t.door.x,z:t.door.z+2.5}],this.hooks.emote&&this.hooks.emote(e,`angry`)}break}case`enter`:this.walk(e,t,X.cust.walk)&&(e.state=`sit`,e.sitT=0);break;case`sit`:e.sitT+=t*3,e.x+=(n.x-e.x)*Math.min(1,t*10),e.z+=(n.z-e.z)*Math.min(1,t*10),e.ry=n.ry,e.sitT>=1&&(e.x=n.x,e.z=n.z,n.cust=e,n.reserved=!1,e.state=`wait`,e.wait=0,this.hooks.order&&this.hooks.order(e));break;case`wait`:{e.wait+=t;let r=this.driedCount(n.belt);e.pat-=t*(1+r*.1),e.sweat=r>0;let i=e.orders[e.oi],a=n.belt;for(let t of a.slots){let r=t.item;if(!(!r||r.dried||r.m!==i||t.res)&&a.dist(a.slotS(t),n.s)<X.belt.grab){e.dishBonus=r.bonus?1.3:1,t.item=null;let n=a.point(a.slotS(t));this.grab(e,i,n);break}}e.state===`wait`&&e.pat<=0&&this.leave(e,!0);break}case`eat`:if(e.eatT-=t,e.bob+=t,e.eatT<=0){e.dish=null,n.dirty++;let t=sf[e.orders[e.oi]].price*this.stage.priceMul*this.seasonMul(),r=this.stars()<3.5&&this.run.cust>10?.85:1,i=1+(e.tipMul-1)+this.perk(`tip`)*.05;e.bill+=Math.round(t*i*r*(e.dishBonus||1)),this.hooks.stat(`plates`,1),this.hooks.served&&this.hooks.served(e.orders[e.oi]),e.oi++,e.oi>=e.orders.length?this.leave(e,!1):(e.state=`wait`,e.wait=0,e.pat=Math.min(e.patMax,e.pat+e.patMax*.5),this.hooks.order&&this.hooks.order(e))}break;case`leave`:this.walk(e,t,X.cust.walk*1.1)&&(e.state=`gone`)}}grab(e,t,n){e.state=`fetch`;let r=e.seat,i=e.wait;e.waits.push(i),i<=X.combo.fast?this.combo++:i>X.combo.slow&&(this.combo=0),this.run.combo=this.combo,this.hooks.stat(`maxCombo`,this.combo),e.tipMul=this.combo>=2?1+Math.min(this.combo*X.combo.tipPer,X.combo.maxMul-1):1,this.fly({k:`dish`,m:t},{x:n.x,y:Uf+.02,z:n.z},{x:r.cx,y:Uf,z:r.cz},()=>{e.state=`eat`,e.dish=t,e.eatT=X.cust.eat,J.play(`eat`)},null,.2,.3),J.play(`happy`),this.combo>=2&&(Xp(r.x,2.3,r.z,`콤보 ${this.combo}<small>팁 +${Math.round((e.tipMul-1)*100)}%</small>`,`pop-combo`,1.1),J.play(`combo`,this.combo),this.hooks.combo&&this.hooks.combo(this.combo,e.tipMul)),this.hooks.emote&&this.hooks.emote(e,i<=X.combo.fast?`heart`:`happy`)}leave(e,t){let n=e.seat;if(e.state===`fetch`)return;e.state=`leave`,n.cust=null,n.reserved=!1,e.dish&&(n.dirty++,e.dish=null);let r=this.lay,i,a=this.driedCount(n.belt);if(t)i=e.oi>0?.25:0,this.combo=0,this.run.combo=0,this.hooks.emote&&this.hooks.emote(e,`angry`),J.play(`angry`),this.hooks.stat(`angry`,1),this.hooks.comboBreak&&this.hooks.comboBreak();else{let t=e.waits.reduce((e,t)=>e+t,0)/Math.max(1,e.waits.length);i=Math.max(.35,Math.min(1,1.1-Math.max(0,t-12)/50-a*.08)),e.omakase&&(e.bill=Math.round(e.bill*1.5),Xp(n.x,2.6,n.z,`오마카세 완주 x1.5!`,`pop-vip`,1.5),Hp(n.x,1.4,n.z,18,{colors:[`#c9a24a`,`#ffffff`,`#5a2d7a`]})),e.vip&&(e.bill*=3,Xp(n.x,2.6,n.z,`VIP 보너스 x3!`,`pop-vip`,1.6),this.hooks.stat(`vip`,1),Hp(n.x,1.4,n.z,30,{colors:[`#ffc83d`,`#ffffff`,`#b58cff`]}),J.play(`unlock`)),this.hooks.emote&&this.hooks.emote(e,i>.8?`heart`:`happy`)}this.run.hist.push(i),this.run.hist.length>20&&this.run.hist.shift(),this.hooks.stat(`bestStars`,this.stars()),e.bill>0&&(n.money+=e.bill,J.play(`cash`),Xp(n.cx,1.5,n.cz,`+`+wp(e.bill),`pop-bill`,1),this.hooks.stat(`customers`,1)),e.path=[{x:n.stand.x,z:n.stand.z},...this.nav.path(n.stand.x,n.stand.z,r.door.x,r.door.z-.6),{x:r.door.x,z:r.door.z+2.5}]}updateRush(e){this.rushT+=e,this.run.rushT=this.rushT;let t=this.run.nextRush||X.rush.first;if(this.rush&&(this.rush.t-=e,this.rush.t<=0&&(this.rush=null,J.setRush(!1),this.hooks.stat(`rushes`,1),this.hooks.rushEnd&&this.hooks.rushEnd())),this.rushT>=t&&this.done.size>=2){let e=this.freeSeats();if(e.length<1){this.run.nextRush=this.rushT+8;return}this.rushT=0,this.run.nextRush=gm(X.rush.min,X.rush.max);let t=this.builtMenus();if(e.length>=3&&(Math.random()<.55||t.length<2)){let n=_m(t),r=Math.min(4,e.length),i=_m($p);e.sort(()=>Math.random()-.5);for(let t=0;t<r;t++){let r=this.spawnCustomer(e[t],{group:!0,menu:n,n:2,shirt:i});r&&(r.x+=t*.5,r.z+=t*.6)}this.rush={t:25,type:`group`,menu:n},J.setRush(!0),this.hooks.banner(`러시 타임!`,`단체 손님 ${r}명: ${sf[n].name} x${r*2}`,n),J.play(`rush`)}else this.spawnCustomer(_m(e),{vip:!0}),this.rush={t:20,type:`vip`},J.setRush(!0),J.duck(.8),this.hooks.banner(`VIP 손님!`,`세트 3종을 순서대로 내면 팁 3배`,null),J.play(`vip`);this.hooks.haptic(30)}}demand(){let e={};for(let t of this.customers)if(t.state===`wait`||t.state===`sit`||t.state===`enter`){let n=t.orders[t.oi];n&&(e[n]=(e[n]||0)+1)}for(let t of this.belts)for(let n of t.slots)n.item&&!n.item.dried&&(e[n.item.m]=(e[n.item.m]||0)-1);return e}goTo(e,t,n,r){e.path=this.nav.path(e.x,e.z,t,n),e.goal={x:t,z:n},e.task=r,e.wait=0}updateStaff(e,t){let n=this.staffSpeed,r=e.x,i=e.z,a=!1;if(e.path.length){a=!0;let r=e.path[0],i=r.x-e.x,o=r.z-e.z,s=Math.hypot(i,o),c=n*t;if(s<=c?(e.x=r.x,e.z=r.z,e.path.shift()):(e.x+=i/s*c,e.z+=o/s*c),s>.02){let n=Math.atan2(i,o)-e.ry;for(;n>Math.PI;)n-=Math.PI*2;for(;n<-Math.PI;)n+=Math.PI*2;e.ry+=n*Math.min(1,t*10)}e.walkT+=t}e.moving=a,this.updateLean(e,t,(e.x-r)/Math.max(t,1e-4),(e.z-i)/Math.max(t,1e-4)),this.actorZones(e,t),!a&&(e.wait+=t,e.think-=t,!(e.think>0)&&(e.think=.25,e.role===`runner`?this.thinkRunner(e):this.thinkHauler(e)))}thinkRunner(e){let t=this.lay,n=e.stack.some(e=>e.k===`dirty`),r=e.stack.some(e=>e.k===`dish`),i=e.task;if(i===`feed`&&r&&e.wait<7||i===`sink`&&n&&e.wait<3||i===`trash`&&e.wait<6&&this.room(e)>0&&this.belts.some(e=>e.built&&this.driedCount(e)>0)||i===`seat`&&e.wait<.6||i===`pick`&&e.wait<1.2&&this.room(e)>0)return;if(n&&this.sink.built&&(this.room(e)<=0||!this.seats.some(e=>e.dirty>0&&!e.cust))){this.goTo(e,t.sink.pad.x,t.sink.pad.z,`sink`);return}if(r){let t=e.stack.filter(e=>e.k===`dish`),n=null,r=-1;for(let e of this.belts){if(!e.built||e.free()===0)continue;let i=e.free();for(let n of this.seats)n.belt===e&&n.cust&&t.some(e=>e.m===n.cust.orders[n.cust.oi])&&(i+=5);i>r&&(r=i,n=e)}if(n){this.goTo(e,n.feed.x+gm(-.12,.12),n.feed.z+gm(-.1,.1),`feed`);return}}if(this.sink.built&&this.room(e)>0){let t=this.seats.filter(e=>e.unlocked&&e.dirty>0&&!e.cust).sort((t,n)=>Math.hypot(t.zone.x-e.x,t.zone.z-e.z)-Math.hypot(n.zone.x-e.x,n.zone.z-e.z))[0];if(t&&!this.staff.some(n=>n!==e&&n.target===t)){e.target=t,this.goTo(e,t.zone.x,t.zone.z,`seat`);return}}e.target=null;let a=this.demand();if(this.room(e)>0){let t=null,n=0;for(let e of Object.values(this.stations)){if(!e.built||e.out<1)continue;let r=a[e.menu]||0;r>n&&(n=r,t=e)}let r=this.belts.some(e=>e.built&&e.free()>1);if(t&&r){this.goTo(e,t.padOut.x,t.padOut.z,`pick`);return}let i=this.belts.find(e=>e.built&&this.driedCount(e)>0);if(i){this.goTo(e,i.trash.x,i.trash.z,`trash`);return}}if(n&&this.sink.built){this.goTo(e,t.sink.pad.x,t.sink.pad.z,`sink`);return}let o=t.idle.runner;Math.hypot(e.x-o.x,e.z-o.z)>1.2&&this.goTo(e,o.x+gm(-.5,.5),o.z+gm(-.3,.3),`idle`)}thinkHauler(e){let t=e.stack.filter(e=>e.k===`ing`);if(e.task===`crate`&&e.wait<1.5&&this.room(e)>0||e.task===`deliver`&&t.length&&e.wait<2)return;if(t.length){let n=t[t.length-1],r=Object.values(this.stations).find(e=>e.built&&e.ing===n.id&&e.inp+e.incoming<X.station.inCap);if(r){this.goTo(e,r.padIn.x,r.padIn.z,`deliver`);return}if(!(this.room(e)>0&&e.task!==`crate`))return}let n=this.demand(),r=null,i=-1e9;for(let e of Object.values(this.stations)){if(!e.built||e.crateN<1)continue;let t=e.inp+e.incoming;if(t>=X.station.inCap-1||e.out>=X.station.outCap&&(n[e.menu]||0)<=0)continue;let a=(n[e.menu]||0)*3-t-e.out*.5;a>i&&(i=a,r=e)}if(r&&!t.length){this.goTo(e,r.crate.pad.x,r.crate.pad.z,`crate`);return}let a=this.lay.idle.hauler;Math.hypot(e.x-a.x,e.z-a.z)>1.2&&this.goTo(e,a.x+gm(-.5,.5),a.z+gm(-.3,.3),`idle`)}updateAnims(e){for(let t=this.anims.length-1;t>=0;t--){let n=this.anims[t];if(n.t+=e,n.t<0)continue;let r=Math.min(1,n.t/n.dur),i=vm(r);n.obj.scale.set(n.base.x*i,n.base.y*i,n.base.z*i),r>=1&&(n.obj.scale.copy(n.base),this.anims.splice(t,1),this.statics.includes(n.obj)&&(this.staticDirty=!0))}if(this.staticDirty&&!this.anims.some(e=>this.statics.includes(e.obj))&&(this.staticDirty=!1,this.rebuildStatic()),this.unlockFx&&(this.unlockFx.t-=e,this.unlockFx.t<=0)){let e=this.unlockFx;this.unlockFx=null,Hp(e.x,.6,e.z,50,{up:7,speed:5}),Up(e.x,e.z,18,`#ffffff`,.6,4),U.shake=.45,J.play(`pop`)}this.camCut&&(this.camCut.t+=e,this.camCut.t>=this.camCut.dur&&(this.camCut=null,this.lastCutEnd=this.time))}guideTarget(){let e=this.hooks.tutTarget&&this.hooks.tutTarget();if(e)return e;let t=this.pads[0];return t&&this.run.money>=t.u.cost*.35-t.paid?{x:t.x,z:t.z}:null}updateGuide(e){let t=this.guideTarget();if(this.guide=t,!t){this.arrow.visible=!1;return}this.arrow.visible=!0,this.arrow.position.set(t.x,2+Math.abs(Math.sin(this.time*4))*.45+(t.y||0),t.z),this.arrow.rotation.y+=e*2.5}render(e){let t=this.inst;t.begin();let n={};for(let e of this.belts)if(e.built)for(let r of e.slots){if(!r.item)continue;let i=e.slotS(r);e.point(i,n);let a=n.a===0?0:n.a===Math.PI?Math.PI:-n.a,o=this.stage.theme===`space`?.12+Math.sin(this.time*2+r.i)*.08:0;this.drawDish(r.item.m,n.x,Uf+.02+o,n.z,a+r.i+(o?this.time*.6:0),1,r.item.dried),r.item.bonus&&!r.item.dried&&t.put(`coin`,n.x,Uf+.42+Math.sin(this.time*4+r.i)*.05,n.z,this.time*3,.55)}for(let e of this.flights){let t=Math.min(1,e.t/e.dur),n=typeof e.to==`function`?e.to():e.to,r=e.from.x+(n.x-e.from.x)*t,i=e.from.z+(n.z-e.from.z)*t,a=e.from.y+(n.y-e.from.y)*t+Math.sin(t*Math.PI)*e.h;this.drawItem(e.it,r,a,i,e.ry+t*4,1)}this.drawStack(this.chef);for(let e of this.staff)this.drawStack(e);for(let e of Object.values(this.stations))if(e.built){for(let t=0;t<e.inp;t++)this.drawItem({k:`ing`,id:e.ing},e.x-.42+t%2*.04,1+t*.12,e.z+(t%2?.03:-.03),.1*t,.9);for(let t=0;t<e.out;t++)this.drawDish(e.menu,e.x+.42,.98+t*.2,e.z,0,1);for(let t=0;t<e.crateN;t++){let n=t%3,r=Math.floor(t/3);this.drawItem({k:`ing`,id:e.ing},e.crate.x-.33+n*.33,.52+r*.16,e.crate.z+(r%2?.1:-.1),r*.3,.9)}}let r=Math.min(this.rack.n,24);for(let e=0;e<r;e++){let n=e%2,r=Math.floor(e/2);t.put(`plate`,this.rack.x-.25+n*.5,.88+r*.07,this.rack.z,0,.9)}if(this.sink.built)for(let e=0;e<Math.min(this.sink.q,14);e++)t.put(`plate`,this.sink.x-.45,.93+e*.07,this.sink.z+.05,e,.9,rm);for(let e of this.seats){if(!e.unlocked)continue;let n=e.side===`R`?1:-1;for(let r=0;r<Math.min(e.dirty,8);r++)t.put(`plate`,e.cx,Uf+r*.07,e.cz-.2*n,r,.85,rm);let r=this.billCount(e);for(let i=0;i<r;i++){let r=i%3,a=Math.floor(i/3);t.put(`cash`,e.cx+(r-1)*.16,Uf+a*.07,e.cz+.22*n,Math.PI/2+i*37%7*.05-.15,.72)}}let i=id(this.theme.noren);for(let e of this.seats){if(!e.unlocked)continue;let n=Math.min(1,(this.time-e.born-.3)/.6);if(n<=0)continue;let r=vm(n);t.put(`stool_seat`,e.x,0,e.z,0,r,i),t.put(`stool_leg`,e.x,0,e.z,0,r)}for(let e of this.staff)this.drawStaff(e);for(let e of this.customers)this.drawCustomer(e);if(!U.renderer.shadowMap.enabled){t.put(`blob`,this.chef.x,.02,this.chef.z,0,1.1);for(let e of this.staff)t.put(`blob`,e.x,.02,e.z,0,1);for(let e of this.customers)t.put(`blob`,e.x,e.state===`enter`||e.state===`leave`?.02:.015,e.z,0,.9)}Gp(e,t),t.end(),this.placeChar(this.chef,e);let a=this.env?.userData.noren;a&&(a.rotation.x=Math.sin(this.time*1.6)*.05);let o=this.padSys;o.begin();let s=this.chef.zone;for(let e of this.zones){if(e.type===`seat`||e.type===`unlock`)continue;let t=this.padBorn.get(this.padKey(e))??-10,n=Math.min(1,(this.time-t-.3)/.6);if(n<=0)continue;let r=(e.type===`upgrade`?1.35:1.18)*vm(n),i=this.padWants(e),a=.9;i&&(r*=1+Math.sin(this.time*7)*.06,a=1.12),s===e&&(r*=1.06,a=1.2);let c=e.type===`crate`||e.type===`in`?e.ref.ing:e.type===`out`?e.ref.menu:e.type;o.put(e.x,e.z,r,e.type,c,a)}o.end();let c=this.chef;s&&s.type!==`unlock`&&s.type!==`upgrade`&&(c.stack.length||c.incoming)&&this.time-(c.lastXfer||-9)<.6?o.gauge(c.x,c.z,(c.stack.length+c.incoming)/this.chefCap()):o.gauge(0,0,null);for(let e of this.pads){let t=this.chef.zone&&this.chef.zone.ref===e,n=e.ui.size*(t?1.06+Math.sin(this.time*18)*.03:1+Math.sin(this.time*3)*.025);this.anims.some(t=>t.obj===e.ui.mesh)||e.ui.mesh.scale.set(n,1,n),!t&&e.ui.lastAfford!==this.run.money>0&&e.ui.draw(e.paid,this.run.money>0)}}padWants(e){let t=this.chef,n=this.chefCap()-t.stack.length-t.incoming,r=e.ref;switch(e.type){case`crate`:return n>0&&r.crateN>0&&r.inp+r.out<6;case`in`:return t.stack.some(e=>e.k===`ing`&&e.id===r.ing)&&r.inp<X.station.inCap;case`out`:return n>0&&r.out>0;case`feed`:return t.stack.some(e=>e.k===`dish`)&&r.free()>0;case`trash`:return n>0&&this.driedCount(r)>0;case`sink`:return t.stack.some(e=>e.k===`dirty`);case`upgrade`:return uf.some(e=>(this.run.upg[e.id]||0)<e.max&&this.run.money>=this.upgCost(e)&&(!e.needStaff||this.staff.length))}return!1}upgCost(e){let t=this.run.upg[e.id]||0;return Math.round(e.base*e.growth**+t*this.stage.priceMul*this.seasonMul())}drawStaff(e){let t=this.inst,n=e.moving,r=n?Math.abs(Math.sin(e.walkT*11))*.07:0,i=Math.min(1,(this.time-e.born-.3)/.6);if(i<=0)return;let a=1.08*vm(i);um.set(0,e.ry,n?Math.sin(e.walkT*11)*.05:0),lm.setFromEuler(um),sm.compose(dm.set(e.x,r,e.z),lm,fm.set(a,a,a)),t.putMatrix(`c_body`,sm,e.shirt),t.putMatrix(`c_legs`,sm,om),cm.makeTranslation(0,.87,0);let o=mm.copy(sm).multiply(cm);t.putMatrix(`c_head`,o,e.skin),t.putMatrix(`c_face`,o,null),t.putMatrix(`st_cap`,o,e.capC);let s=e.stack.length>0||e.incoming>0,c=n?Math.sin(e.walkT*11):0;for(let n of[-1,1])um.set(s?-1.35:n*c*.6,0,n*(s?-.1:-.18)),lm.setFromEuler(um),cm.compose(dm.set(n*.23,.56,0),lm,fm.set(1,1,1)),t.putMatrix(`c_arm`,pm.copy(sm).multiply(cm),e.shirt)}placeChar(e,t){let n=e.mesh;if(n.position.set(e.x,0,e.z),n.rotation.y=e.ry,lp(n,e.walkT,e.moving,e.stack.length>0||e.incoming>0,e.isChef?this.chefSpeed/3.4:.8),e.bump>0){e.bump=Math.max(0,e.bump-t*6);let r=Math.sin(e.bump*Math.PI)*.09;n.scale.set(1+r,1-r,1+r)}else n.scale.set(1,1,1)}drawStack(e){let t=0,n=e.isChef?.42:.36,r=Math.sin(e.ry)*n,i=Math.cos(e.ry)*n,a=e.isChef?.74:.6,o=e.stack.length,s=e.moving?Math.sin(e.walkT*11)*.02:0,c=1.22;for(let n=0;n<o;n++){let o=e.stack[n],l=t**1.25*.55,u=e.x+r+e.lean.x*l+Math.cos(e.ry)*s*t,d=e.z+i+e.lean.z*l-Math.sin(e.ry)*s*t;this.drawItem(o,u,a+t,d,e.ry+Math.sin(n*1.7)*.12,c),t+=($f[o.k]||.2)*c}}drawItem(e,t,n,r,i,a){let o=this.inst;switch(e.k){case`ing`:o.put(`ing_`+e.id,t,n,r,i,a);break;case`dish`:this.drawDish(e.m,t,n,r,i,a,!1);break;case`dirty`:o.put(`plate`,t,n,r,i,a,rm);break;case`coin`:o.put(`coin`,t,n,r,i*3,a*1.1,null,0,0);break;case`cash`:o.put(`cash`,t,n,r,i,a)}}drawDish(e,t,n,r,i,a,o){this.inst.put(`plate`,t,n,r,i,a,o?im:id(sf[e].plate)),this.inst.put(`top_`+e,t,n,r,i,a,o?nm:null)}drawCustomer(e){let t=this.inst,n=e.state===`wait`||e.state===`eat`||e.state===`fetch`||e.state===`sit`&&e.sitT>.3,r=(e.state===`enter`||e.state===`leave`||e.state===`toQueue`||e.state===`queue`)&&e.path.length>0,i=r?Math.abs(Math.sin(e.walkT*10))*.08:0,a=n?.42:i,o=e.scale;um.set(0,e.ry,r?Math.sin(e.walkT*10)*.06:0),lm.setFromEuler(um),sm.compose(dm.set(e.x,a,e.z),lm,fm.set(o,o,o)),t.putMatrix(`c_body`,sm,e.shirt),n?t.putMatrix(`c_legs`,pm.copy(sm).multiply(hm),e.pants):t.putMatrix(`c_legs`,sm,e.pants);let s=0,c=0;e.state===`eat`?(s=Math.abs(Math.sin(e.bob*9))*.05,c=.25):e.state===`wait`&&e.pat<e.patMax*.3&&(c=Math.sin(this.time*20)*.08),um.set(c,0,e.state===`wait`&&e.pat<e.patMax*.3?Math.sin(this.time*20)*.1:0),lm.setFromEuler(um),cm.compose(dm.set(0,.87+s,0),lm,fm.set(1,1,1));let l=mm.copy(sm).multiply(cm);t.putMatrix(`c_head`,l,e.skin),t.putMatrix(`c_hair`,l,e.hair),t.putMatrix(`c_face`,l,null),e.vip&&(cm.makeTranslation(0,.22,0),t.putMatrix(`c_crown`,pm.copy(l).multiply(cm),null)),e.dish&&this.drawDish(e.dish,e.seat.cx,Uf,e.seat.cz,0,1-Math.max(0,1-e.eatT/X.cust.eat)*.35,!1)}serialize(){let e=this.run;e.st={},e.cr={};for(let t of Object.values(this.stations))t.built&&(e.st[t.menu]={i:t.inp+t.incoming,o:t.out},e.cr[t.menu]=t.crateN);e.sinkQ=this.sink.q,e.belts={};for(let t of this.belts)e.belts[t.id]=t.slots.map(e=>e.item?{m:e.item.m,l:e.item.laps,d:+!!e.item.dried}:null);e.stack=this.chef.stack.slice(),e.staff=this.staff.map(e=>({role:e.role,stack:e.stack.slice()})),e.seats={};for(let t of this.seats){let n=t.dirty,r=t.money,i=t.cust;i&&((i.dish||i.state===`fetch`)&&n++,r+=i.bill||0),e.seats[t.id]={d:n,m:r}}e.combo=this.combo}idleRate(){let e=this.staff.filter(e=>e.role===`runner`).length,t=this.staff.filter(e=>e.role===`hauler`).length;if(!e)return 0;let n=this.seats.filter(e=>e.unlocked).length,r=this.builtMenus(),i=r.reduce((e,t)=>e+sf[t].price,0)/Math.max(1,r.length),a=Math.min(1,e*.45+t*.35);return n*i*this.stage.priceMul*.05*a*(this.stars()/5)*this.stage.cust*X.offline.share}debugUnlockAll(){let e=0;for(;e++<40;){let e=this.pads[0];if(!e||e.u.t===`next`||e.u.t===`final`)break;this.doUnlock(e)}}},bm=class{constructor(e,t){this.p=e,this.hooks=t,this.checkDay()}checkDay(){let e=bf(),t=this.p.missions;return t.day!==e||!Array.isArray(t.list)||t.list.length!==3?(t.day=e,t.list=this.rollMissions(),!0):!1}rollMissions(){let e=_f.slice(),t=[],n=this.p.stage,r=[1,2.2,4,7,11][n]||1,i=df[n].priceMul;for(;t.length<3&&e.length;){let a=Math.floor(Math.random()*e.length),o=e.splice(a,1)[0],s=o.base;o.money?s=Math.round(o.base*i*r/10)*10:!o.max&&o.type!==`unlocks`&&o.type!==`vip`?s=Math.round(o.base*Math.sqrt(r)):o.type===`combo`&&(s=o.base+n*2),t.push({type:o.type,n:s,text:o.text.replace(`{n}`,s.toLocaleString(`ko-KR`)),prog:0,reward:o.reward+n*2,done:!1,claimed:!1})}return t}stat(e,t){let n=this.p.stats;e===`maxCombo`?(n.maxCombo=Math.max(n.maxCombo,t),this.mission(`combo`,t,!0)):e===`bestStars`?n.bestStars=Math.max(n.bestStars,t):(n[e]=(n[e]||0)+t,this.mission(e,t,!1)),this.checkAch()}mission(e,t,n){this.checkDay()&&this.hooks.missionsChanged&&this.hooks.missionsChanged();for(let r of this.p.missions.list)r.type!==e||r.done||(r.prog=n?Math.max(r.prog,t):r.prog+t,r.prog>=r.n&&(r.prog=r.n,r.done=!0,this.hooks.missionDone&&this.hooks.missionDone(r)));this.hooks.missionsChanged&&this.hooks.missionsChanged()}claimMission(e){let t=this.p.missions.list[e];return!t||!t.done||t.claimed?0:(t.claimed=!0,this.p.pearls+=t.reward,t.reward)}unclaimed(){return this.p.missions.list.filter(e=>e.done&&!e.claimed).length}achValue(e){let t=this.p.stats;return e.stat===`stage`?this.p.stage+1:t[e.stat]||0}checkAch(){for(let e of gf)this.p.ach[e.id]||this.achValue(e)>=e.goal&&(this.p.ach[e.id]=1,this.hooks.achDone&&this.hooks.achDone(e))}claimAch(e){let t=gf.find(t=>t.id===e);return!t||this.p.ach[e]!==1?0:(this.p.ach[e]=2,this.p.pearls+=t.reward,t.reward)}achUnclaimed(){return gf.filter(e=>this.p.ach[e.id]===1).length}attendAvailable(){return this.p.attend.last!==bf()}attendClaim(e){if(!this.attendAvailable())return null;let t=this.p.attend,n=t.day%7,r=vf[n];t.last=bf(),t.day+=1;let i={day:n+1};return r.pearls&&(this.p.pearls+=r.pearls,i.pearls=r.pearls),r.money&&(i.money=Math.round(e*r.money)),r.hat&&!this.p.cos.hats.includes(r.hat)&&(this.p.cos.hats.push(r.hat),i.hat=r.hat),i}discover(e){if(!sf[e])return!1;let t=!this.p.dex[e];return this.p.dex[e]=this.p.dex[e]||{found:Date.now(),served:0},t}served(e){this.p.dex[e]||this.discover(e),this.p.dex[e].served++}},Q=(e,t=document)=>t.querySelector(e),xm={x:0,y:0,vis:!1},Sm=class{constructor(e){this.app=e,this.hud=document.getElementById(`hud`),this.layer=document.getElementById(`layer`),this.wui=document.getElementById(`world-ui`),this.bubbles=new Map,this.stBadges=new Map,this.shownMoney=0,this.panel=null,this.buildHud()}buildHud(){this.hud.innerHTML=`
      <div class="hud-grad"></div>
      <div class="hud-top">
        <div class="hud-left">
          <div class="pill money" id="h-money-pill"><span class="ic">${Z.coin}</span><b id="h-money">0</b></div>
          <div class="pill pearls"><span class="ic">${Z.pearl}</span><b id="h-pearls">0</b></div>
        </div>
        <div class="hud-center">
          <div class="prog"><div class="prog-fill" id="h-prog"></div><span id="h-prog-t"></span></div>
          <div class="subline"><span class="next-goal" id="h-next"></span><span class="rating"><span class="ic">${Z.star}</span><b id="h-stars">3.0</b><span class="hb"><i id="h-heart"></i></span></span></div>
        </div>
        <div class="hud-right">
          <button class="rbtn" id="b-pause" aria-label="일시정지">${Z.pause}</button>
          <button class="rbtn" id="b-menu" aria-label="메뉴">${Z.menu}<i class="dot" id="bd-menu"></i></button>
        </div>
      </div>
      <div class="menu-pop" id="menu-pop">
        <button class="mitem" data-m="mission">${Z.mission}<span>미션</span><i class="badge" id="bd-mission"></i></button>
        <button class="mitem" data-m="attend">${Z.calendar}<span>출석</span><i class="badge" id="bd-attend"></i></button>
        <button class="mitem" data-m="perk">${Z.up2}<span>영구 강화</span><i class="badge" id="bd-perk"></i></button>
        <button class="mitem" data-m="dex">${Z.book}<span>도감</span><i class="badge" id="bd-dex"></i></button>
        <button class="mitem" data-m="cos">${Z.shirt}<span>코스튬</span></button>
        <button class="mitem" data-m="ach">${Z.trophy}<span>업적</span><i class="badge" id="bd-ach"></i></button>
        <button class="mitem" data-m="mute" id="b-mute">${Z.sound}<span>소리</span></button>
      </div>
      <div class="demand" id="h-demand"></div>
      <div class="combo" id="h-combo"></div>
      <div class="banner" id="h-banner"></div>
      <div class="toast" id="h-toast"></div>
      <div class="tut" id="h-tut"></div>
      <div class="hand" id="h-hand">${Z.hand}</div>
      <div class="edge" id="h-edge">${Z.arrow}</div>
      <div class="cap" id="h-cap"></div>
      <div class="rushbar" id="h-rush"><div></div></div>
    `;let e=(e,t)=>Q(e).addEventListener(`click`,e=>{e.stopPropagation(),J.play(`click`),t()});e(`#b-pause`,()=>{this.toggleMenu(!1),this.openPause()}),e(`#b-menu`,()=>this.toggleMenu()),this.hud.querySelectorAll(`.mitem`).forEach(e=>e.addEventListener(`click`,t=>{t.stopPropagation(),J.play(`click`);let n=e.dataset.m;if(n===`mute`){this.app.toggleMute();return}this.toggleMenu(!1),{mission:()=>this.openMissions(),attend:()=>this.openAttend(),perk:()=>this.openPerks(),dex:()=>this.openDex(),cos:()=>this.openCostume(),ach:()=>this.openAch()}[n]()})),this.hud.querySelectorAll(`button`).forEach(e=>e.addEventListener(`pointerdown`,e=>e.stopPropagation())),document.getElementById(`gl`).addEventListener(`pointerdown`,()=>this.toggleMenu(!1))}toggleMenu(e){let t=Q(`#menu-pop`),n=e===void 0?!t.classList.contains(`show`):e;t.classList.toggle(`show`,n)}setMuteIcon(e){let t=Q(`#b-mute`);t&&(t.innerHTML=`${e?Z.sound:Z.mute}<span>${e?`소리 켜짐`:`소리 꺼짐`}</span>`)}updateHud(e){let t=this.app,n=t.game,r=t.p,i=Math.floor(n.run.money),a=i-this.shownMoney;this.moneyHold>performance.now()||(Math.abs(a)<1?this.shownMoney=i:this.shownMoney+=a*Math.min(1,e*12)+Math.sign(a)*.5);let o=wp(Math.max(0,Math.round(this.shownMoney)));if(this._mt!==o&&(Q(`#h-money`).textContent=o,this._mt=o),this.shownPearls===void 0&&(this.shownPearls=r.pearls),!(this.pearlHold>performance.now())){let t=r.pearls-this.shownPearls;Math.abs(t)<1?this.shownPearls=r.pearls:this.shownPearls+=t*Math.min(1,e*8)+Math.sign(t)*.3}let s=wp(Math.round(this.shownPearls));this._pt!==s&&(Q(`#h-pearls`).textContent=s,this._pt=s);let c=n.stage,l=c.unlocks.length,u=n.done.size,d=c.name+u;this._sk!==d&&(this._sk=d,Q(`#h-prog`).style.width=`${u/l*100}%`,Q(`#h-prog-t`).textContent=`${r.season>1?r.season+`시즌 `:``}${r.stage+1}호점 ${c.name} ${u}/${l}`);let f=n.pads[0],p=f?f.u.id+ +(n.run.money>=f.u.cost-f.paid):``;if(this._nk!==p){this._nk=p;let e=Q(`#h-next`);f?(e.innerHTML=`<b>${n.unlockLabel(f.u).label}</b><span class="ic">${Z.coin}</span>${wp(f.u.cost)}`,e.classList.toggle(`ready`,n.run.money>=f.u.cost-f.paid)):e.textContent=`모든 시설 완성!`}let m=n.stars().toFixed(1);if(this._st!==m&&(Q(`#h-stars`).textContent=m,this._st=m),Q(`#h-heart`).style.width=`${n.satisfaction()*100}%`,this.demandT=(this.demandT||0)-e,this.demandT<=0){this.demandT=.3;let e={};for(let t of n.customers)if(t.state===`wait`||t.state===`eat`||t.state===`fetch`){let n=t.orders[t.oi];t.state===`wait`&&n&&(e[n]=(e[n]||0)+1)}let i={};for(let e of n.belts)for(let t of e.slots)t.item&&!t.item.dried&&(i[t.item.m]=(i[t.item.m]||0)+1);let a=n.builtMenus(),o=`<span class="dl">주문</span>`;for(let t of a){let n=e[t]||0,r=n>(i[t]||0)?`need`:n>0?`ok`:`none`;o+=`<span class="dm ${r}">${Qf(t)}<b>${n}</b></span>`}let s=n.belts.reduce((e,t)=>e+(t.built?n.driedCount(t):0),0);s&&(o+=`<span class="dm dry">마른 접시 <b>${s}</b></span>`),n.rack.n<=2&&(o+=`<span class="dm plate ${n.rack.n===0?`need`:``}">${Z.plate}<b>${n.rack.n}</b></span>`),o!==this._dh&&(Q(`#h-demand`).innerHTML=o,this._dh=o);let c=t.meta.unclaimed();Q(`#bd-mission`).textContent=c?String(c):``,Q(`#bd-mission`).classList.toggle(`on`,c>0);let l=t.meta.achUnclaimed();Q(`#bd-ach`).textContent=l?String(l):``,Q(`#bd-ach`).classList.toggle(`on`,l>0),Q(`#bd-attend`).classList.toggle(`on`,t.meta.attendAvailable()),Q(`#bd-attend`).textContent=t.meta.attendAvailable()?`!`:``,Q(`#bd-dex`).classList.toggle(`on`,!!t.newDex),Q(`#bd-dex`).textContent=t.newDex?`N`:``;let u=t.perkAffordable?t.perkAffordable():!1;Q(`#bd-perk`).classList.toggle(`on`,u),Q(`#bd-perk`).textContent=u?`!`:``;let d=c>0||l>0||t.meta.attendAvailable()||!!t.newDex||u;Q(`#bd-menu`).classList.toggle(`on`,d);let f=r.tut<6&&r.stage===0;Q(`#b-menu`).style.display=f?`none`:``,f&&this.toggleMenu(!1);let p=Q(`#h-demand`).getBoundingClientRect(),m=document.getElementById(`app`).getBoundingClientRect();this.hudBottom=p.bottom-m.top+4,window.__hudBottom=this.hudBottom;let h=n.chefCap(),g=n.chef.stack.length,_=Q(`#h-cap`);_.textContent=g?`${g}/${h}`:``,_.classList.toggle(`on`,g>0),_.classList.toggle(`max`,g>=h)}let h=Q(`#h-rush`);n.rush?(h.classList.add(`on`),h.firstChild.style.width=`${n.rush.t/(n.rush.type===`vip`?20:25)*100}%`):h.classList.remove(`on`)}flyReward(e,t=`pearl`,n=8){let r=document.getElementById(`app`),i=r.getBoundingClientRect(),a=e.getBoundingClientRect?e.getBoundingClientRect():e,o=a.left+a.width/2-i.left,s=a.top+a.height/2-i.top,c=Q(t===`pearl`?`.pill.pearls .ic`:`#h-money-pill .ic`).getBoundingClientRect(),l=c.left+c.width/2-i.left,u=c.top+c.height/2-i.top,d=document.getElementById(`fx-top`);d||(d=document.createElement(`div`),d.id=`fx-top`,r.appendChild(d)),t===`pearl`?this.pearlHold=performance.now()+520:this.moneyHold=performance.now()+520;for(let e=0;e<n;e++){let n=document.createElement(`div`);n.className=`flyi`,n.innerHTML=t===`pearl`?Z.pearl:Z.coin,d.appendChild(n);let r=o+(Math.random()-.5)*60,i=s+(Math.random()-.5)*40,a=(r+l)/2+(Math.random()-.5)*120,c=Math.min(i,u)-60-Math.random()*80,f=e*45,p=520+Math.random()*120,m=performance.now()+f,h=()=>{let e=(performance.now()-m)/p;if(e<0)return requestAnimationFrame(h);if(e>=1){n.remove(),J.play(`coin`);let e=Q(t===`pearl`?`.pill.pearls`:`#h-money-pill`);e.classList.remove(`bump`),e.offsetWidth,e.classList.add(`bump`);return}let o=e*e,s=(1-o)*(1-o)*r+2*(1-o)*o*a+o*o*l,d=(1-o)*(1-o)*i+2*(1-o)*o*c+o*o*u,f=e<.15?.4+e*5:1.15-e*.4;n.style.transform=`translate(${s}px, ${d}px) translate(-50%, -50%) scale(${f})`,requestAnimationFrame(h)};requestAnimationFrame(h)}}curtain(e,t=``){let n=document.getElementById(`app`),r=document.createElement(`div`);r.className=`curtain`,r.innerHTML=`<div class="cp"></div><div class="cp"></div><div class="cp"></div><div class="ct">${t}</div>`,n.appendChild(r),requestAnimationFrame(()=>r.classList.add(`down`)),J.play(`whoosh`),setTimeout(()=>{e&&e(),setTimeout(()=>{r.classList.remove(`down`),r.classList.add(`up`),J.play(`pop`),setTimeout(()=>r.remove(),600)},650)},480)}updatePointer(e,t){let n=document.getElementById(`h-point`);if(n||(n=document.createElement(`div`),n.id=`h-point`,n.className=`point`,n.innerHTML=`<i></i>${Z.hand}`,this.hud.appendChild(n)),!t||!e){n.classList.remove(`show`);return}nd(e.x,.1,e.z,xm);let r=xm.x>20&&xm.x<this.app.W()-20&&xm.y>120&&xm.y<this.app.H()-40;n.classList.toggle(`show`,r),r&&(n.style.transform=`translate(${xm.x}px, ${xm.y}px)`)}flashMoney(){let e=Q(`#h-money-pill`);e.classList.remove(`bump`),e.offsetWidth,e.classList.add(`bump`)}toast(e,t=``){let n=Q(`#h-toast`);n.className=`toast show `+t,n.textContent=e,clearTimeout(this._tt),this._tt=setTimeout(()=>n.className=`toast`,2200)}banner(e,t,n){let r=Q(`#h-banner`);r.innerHTML=`<b>${e}</b><span>${n?Qf(n,`mi sm`):``}${t}</span>`,r.classList.remove(`show`),r.offsetWidth,r.classList.add(`show`),clearTimeout(this._bt),this._bt=setTimeout(()=>r.classList.remove(`show`),3200)}combo(e,t){let n=Q(`#h-combo`);n.innerHTML=`<b>콤보 ${e}</b><span>팁 x${t.toFixed(1)}</span>`,n.classList.remove(`show`),n.offsetWidth,n.classList.add(`show`),clearTimeout(this._ct),this._ct=setTimeout(()=>n.classList.remove(`show`),2400)}comboBreak(){let e=Q(`#h-combo`);e.classList.contains(`show`)&&(e.innerHTML=`<b>콤보 끊김</b>`,e.classList.add(`broken`),setTimeout(()=>e.classList.remove(`show`,`broken`),900))}tut(e,t){let n=Q(`#h-tut`);e?(n.textContent!==e&&(n.textContent=e),n.classList.add(`show`)):n.classList.remove(`show`),Q(`#h-hand`).classList.toggle(`show`,!!t)}updateEdge(e){let t=Q(`#h-edge`);if(!e){t.classList.remove(`show`);return}nd(e.x,.5,e.z,xm);let n=this.app.W(),r=this.app.H();if(xm.x>40&&xm.x<n-40&&xm.y>120&&xm.y<r-60){t.classList.remove(`show`);return}let i=n/2,a=r/2,o=xm.x-i,s=xm.y-a,c=Math.atan2(s,o),l=Math.min(Math.abs((n/2-40)/(o||1e-6)),Math.abs((r/2-110)/(s||1e-6))),u=i+o*l,d=a+s*l;t.style.transform=`translate(${u}px, ${d}px) translate(-50%,-50%) rotate(${c+Math.PI/2}rad)`,t.classList.add(`show`)}clearWorld(){this.bubbles.forEach(e=>e.el.remove()),this.bubbles.clear(),this.stBadges.forEach(e=>e.remove()),this.stBadges.clear(),this.maxEl&&this.maxEl.classList.remove(`on`)}updateWorld(){let e=this.app.game,t=new Set;for(let n of e.customers){if(n.state!==`wait`&&n.state!==`eat`&&n.state!==`fetch`)continue;t.add(n.id);let e=this.bubbles.get(n.id);if(!e){let t=document.createElement(`div`);t.className=`bubble`+(n.vip?` vip`:``)+(n.omakase?` omakase`:``)+(n.group?` group`:``),this.wui.appendChild(t),e={el:t,key:``},this.bubbles.set(n.id,e)}let r=n.oi+`:`+n.state+`:`+ +!!n.sweat;if(e.key!==r){e.key=r;let t=``;if(n.vip||n.omakase)t+=n.vip?`<span class="crown">${Z.crown}</span><div class="set">`:`<span class="omk">코스</span><div class="set">`,n.orders.forEach((e,r)=>t+=`<span class="si ${r<n.oi?`done`:r===n.oi?`cur`:``}">${Qf(e)}</span>`),t+=`</div>`;else if(n.state===`wait`){t+=Qf(n.orders[n.oi]);let e=n.orders.length-n.oi;e>1&&(t+=`<small>x${e}</small>`)}else t+=`<span class="eating">냠냠</span>`;n.sweat&&n.state===`wait`&&(t+=`<span class="sw">${Z.sweat}</span>`),t+=`<i class="pat"></i>`,e.el.innerHTML=t,e.pat=e.el.querySelector(`.pat`)}nd(n.x,1.9,n.z,xm),e.el.style.transform=`translate(${xm.x+n.seat.out*16}px, ${xm.y}px) translate(-50%, -100%)`;let i=n.state===`wait`?Math.max(0,n.pat/n.patMax):n.state===`eat`?1-Math.max(0,n.eatT/X.cust.eat):0;e.el.style.opacity=xm.y-44<(this.hudBottom||0)?`0.25`:``,e.pat&&(e.pat.style.setProperty(`--p`,i.toFixed(3)),e.el.classList.toggle(`late`,i<.3&&n.state===`wait`),e.el.classList.toggle(`eat`,n.state!==`wait`))}for(let[e,n]of this.bubbles)t.has(e)||(n.el.remove(),this.bubbles.delete(e));this.maxEl||(this.maxEl=document.createElement(`div`),this.maxEl.className=`maxtag`,this.maxEl.textContent=`MAX`,this.wui.appendChild(this.maxEl));let n=e.chef,r=n.stack.length>=e.chefCap();if(this.maxEl.classList.toggle(`on`,r),r){let t=e.stackTopPos(n);nd(t.x,t.y+.35,t.z,xm),this.maxEl.style.transform=`translate(${xm.x}px, ${xm.y}px) translate(-50%, -100%)`}for(let t of Object.values(e.stations)){if(!t.built)continue;let n=this.stBadges.get(t.menu);n||(n=document.createElement(`div`),n.className=`stb`,n.innerHTML=`<div class="cook"><i></i></div><span></span>`,this.wui.appendChild(n),this.stBadges.set(t.menu,n)),nd(t.x,1.95,t.z,xm),n.style.transform=`translate(${xm.x}px, ${xm.y}px) translate(-50%, -100%)`,n.style.opacity=xm.y-26<(this.hudBottom||0)?`0`:``;let r=t.inp>0&&t.out<X.station.outCap&&e.rack.n>0;n.firstChild.style.display=r?``:`none`,n.firstChild.firstChild.style.width=`${t.t/e.cookTime*100}%`;let i=``,a=``;t.inp>0&&e.rack.n<=0?(i=`접시 없음!`,a=`bad`):t.out>=X.station.outCap?(i=`가득`,a=`full`):t.inp===0&&t.out===0&&t.incoming===0&&e.customers.some(e=>e.state===`wait`&&e.orders[e.oi]===t.menu)&&(i=`재료 필요`,a=`idle`);let o=n.lastChild;o.textContent!==i&&(o.textContent=i),o.className!==a&&(o.className=a)}}emote(e,t){let n=document.createElement(`div`);n.className=`emote `+t,n.innerHTML=t===`angry`?Z.angry:t===`heart`?Z.heart:Z.happy,this.wui.appendChild(n);let r=performance.now(),i=e.x,a=e.z,o=()=>{let e=(performance.now()-r)/1e3;if(e>1.2){n.remove();return}nd(i,2.2+e*.9,a,xm),n.style.transform=`translate(${xm.x}px, ${xm.y}px) translate(-50%,-50%) scale(${e<.15?e/.15:1})`,n.style.opacity=e>.9?String((1.2-e)/.3):`1`,requestAnimationFrame(o)};o()}open(e,t=``,n=null,r={}){this.close(!0);let i=document.createElement(`div`);i.className=`modal `+t,i.innerHTML=`<div class="sheet">${r.noClose?``:`<button class="x" aria-label="닫기">✕</button>`}${e}</div>`,this.layer.appendChild(i),requestAnimationFrame(()=>i.classList.add(`show`)),i.addEventListener(`pointerdown`,e=>e.stopPropagation());let a=i.querySelector(`.x`);return a&&a.addEventListener(`click`,()=>{J.play(`click`),this.close()}),r.noBackdrop||i.addEventListener(`click`,e=>{e.target===i&&!r.noClose&&this.close()}),this.panel={el:i,onClose:n,cls:t},this.app.setPaused(!0,`panel`),J.holdBgm(t===`pause`||t===`confirm`),J.play(`open`),i}close(e=!1){if(!this.panel)return;let{el:t,onClose:n}=this.panel;this.panel=null,t.classList.remove(`show`),setTimeout(()=>t.remove(),180),this.app.setPaused(!1,`panel`),J.holdBgm(this.app.pauseReasons.has(`title`)),n&&!e&&n()}showTitle(e){let t=this.app.p,n=t.records.length?t.records.reduce((e,t)=>e+(t.earned||0),0)+t.run.earned:t.run.earned,r=document.createElement(`div`);r.className=`title`,r.innerHTML=`
      <div class="t-sky"></div>
      <div class="t-logo">
        <div class="t-plate"><img src="${Zf(`menu`,`salmon`,160)}" alt=""></div>
        <h1><span>스시</span><span>루프</span></h1>
        <p>회전초밥집 키우기</p>
      </div>
      <div class="t-best">
        <div>최고 식당 <b>${t.stage+1}호점 · ${df[t.stage].name}</b></div>
        <div>누적 수익 <b>${wp(n)}</b></div>
      </div>
      <button class="big-btn" id="t-start">${t.stats.plates>0?`이어하기`:`영업 시작`}</button>
      <button class="rbtn t-mute" id="t-mute">${this.app.p.settings.sfx||this.app.p.settings.bgm?Z.sound:Z.mute}</button>
      <div class="t-load"><i></i></div>
    `,this.layer.appendChild(r),r.addEventListener(`pointerdown`,e=>e.stopPropagation()),Q(`#t-mute`,r).addEventListener(`click`,e=>{e.stopPropagation(),this.app.toggleMute(),Q(`#t-mute`,r).innerHTML=this.app.p.settings.sfx||this.app.p.settings.bgm?Z.sound:Z.mute}),Q(`#t-start`,r).addEventListener(`click`,()=>{r.classList.add(`hide`),setTimeout(()=>r.remove(),400),e()}),this.titleEl=r}openPause(){let e=this.app.p.settings,t=(e,t,n)=>`<label class="tg"><span>${t}</span><input type="checkbox" id="${e}" ${n?`checked`:``}><i></i></label>`,n=this.open(`<h2>일시정지</h2>
      <button class="big-btn" id="p-resume">계속하기</button>
      <div class="settings">
        ${t(`s-sfx`,`효과음`,e.sfx)}${t(`s-bgm`,`배경음악`,e.bgm)}${t(`s-hap`,`진동`,e.haptic)}${t(`s-sh`,`그림자 (끄면 더 빠름)`,e.shadows&&!this.app.sessionLowQ)}
      </div>
      <div class="row2">
        <button class="btn" id="p-stats">${Z.chart} 통계</button>
        <button class="btn" id="p-title">타이틀로</button>
      </div>
      <div class="row2">
        <button class="btn warn" id="p-restart">식당 다시 시작</button>
        <button class="btn warn" id="p-wipe">데이터 초기화</button>
      </div>
      <p class="hint">자동 저장 중 · 스시 루프 v1.0</p>`,`pause`);Q(`#p-resume`,n).onclick=()=>this.close(),Q(`#s-sfx`,n).onchange=e=>this.app.setSetting(`sfx`,e.target.checked),Q(`#s-bgm`,n).onchange=e=>this.app.setSetting(`bgm`,e.target.checked),Q(`#s-hap`,n).onchange=e=>this.app.setSetting(`haptic`,e.target.checked),Q(`#s-sh`,n).onchange=e=>{this.app.p.settings.qLocked=!0,this.app.setSetting(`shadows`,e.target.checked)},Q(`#p-stats`,n).onclick=()=>this.openStats(),Q(`#p-title`,n).onclick=()=>{this.close(!0),this.app.toTitle()},Q(`#p-restart`,n).onclick=()=>this.confirm(`이 식당을 처음부터 다시 시작할까요? 현재 식당의 돈과 해금이 초기화돼요.`,()=>this.app.restartStage()),Q(`#p-wipe`,n).onclick=()=>this.confirm(`모든 저장 데이터를 지울까요? 되돌릴 수 없어요.`,()=>this.app.wipeAll())}confirm(e,t){let n=this.open(`<h2>확인</h2><p class="cf">${e}</p><div class="row2"><button class="btn" id="c-no">취소</button><button class="btn warn" id="c-yes">확인</button></div>`,`confirm`);Q(`#c-no`,n).onclick=()=>this.close(),Q(`#c-yes`,n).onclick=()=>{this.close(!0),t()}}openUpgrade(e=`chef`){let t=this.app.game,n=t.run,r=t.staff.length>0,i=[[`chef`,`셰프`],[`shop`,`식당`],[`staff`,`직원`]],a=``,o=this.app.recommendUpgrade?this.app.recommendUpgrade():null;for(let t of uf.filter(t=>t.tab===e)){let e=n.upg[t.id]||0,i=e>=t.max,s=this.app.upgCost(t),c=t.needStaff&&!r,l=Array.from({length:t.max},(t,n)=>`<i class="${n<e?`on`:``}"></i>`).join(``);a+=`<div class="up-row ${c?`locked`:``} ${o===t.id?`rec`:``}">
        <div class="up-ic ic-${t.icon}">${Z[t.icon]||Z.up}</div>
        <div class="up-info"><b>${t.name}${o===t.id?`<em class="rtag">추천</em>`:``}</b><small>${c?`직원을 먼저 고용하세요`:t.desc}</small><div class="pips">${l}</div></div>
        <button class="btn buy" data-id="${t.id}" ${i||c||n.money<s?`disabled`:``}>${i?`MAX`:`<span class="ic">${Z.coin}</span>${wp(s)}`}</button>
      </div>`}let s=this.open(`<h2>업그레이드</h2>
      <div class="tabs">${i.map(([t,n])=>`<button class="tab ${t===e?`on`:``}" data-tab="${t}">${n}</button>`).join(``)}</div>
      <div class="money-line"><span class="ic">${Z.coin}</span><b>${wp(n.money)}</b></div>
      <div class="up-list">${a}</div>`,`upgrade`);s.querySelectorAll(`.tab`).forEach(e=>e.addEventListener(`click`,()=>{J.play(`click`),this.openUpgrade(e.dataset.tab)})),s.querySelectorAll(`.buy`).forEach(t=>t.addEventListener(`click`,()=>{this.app.buyUpgrade(t.dataset.id)&&this.openUpgrade(e)}))}openMissions(){let e=this.app.p;this.app.meta.checkDay();let t=new Date,n=new Date(t);n.setHours(24,0,0,0);let r=Math.max(0,n-t),i=`<h2>일일 미션</h2><p class="sub">새 미션까지 ${Math.floor(r/36e5)}시간 ${Math.floor(r%36e5/6e4)}분</p><div class="ms">`;e.missions.list.forEach((e,t)=>{i+=`<div class="mcard ${e.claimed?`claimed`:e.done?`done`:``}">
        <div class="mt"><b>${e.text}</b><div class="bar"><i style="width:${Math.min(100,e.prog/e.n*100)}%"></i></div><small>${wp(e.prog)} / ${wp(e.n)}</small></div>
        <button class="btn claim" data-i="${t}" ${e.done&&!e.claimed?``:`disabled`}>${e.claimed?`완료`:`<span class="ic">${Z.pearl}</span>${e.reward}`}</button>
      </div>`}),i+=`</div><p class="hint">진주로 코스튬과 인테리어를 살 수 있어요</p>`,this.open(i,`missions`).querySelectorAll(`.claim`).forEach(e=>e.addEventListener(`click`,()=>{let t=this.app.meta.claimMission(+e.dataset.i);t&&(this.flyReward(e,`pearl`,Math.min(12,4+Math.floor(t/3))),this.app.save(),this.openMissions(),this.toast(`진주 +${t}`,`good`))}))}openAttend(){let e=this.app.p,t=this.app.meta.attendAvailable(),n=e.attend.day%7,r=this.app.moneyUnit(),i=``;vf.forEach((a,o)=>{o<n||!t&&o===(n+6)%7&&e.attend.day;let s=t&&o===n,c=``;a.pearls&&(c+=`<span class="ic">${Z.pearl}</span>${a.pearls}`),a.money&&(c+=`<span class="ic">${Z.coin}</span>${wp(r*a.money)}`),a.hat&&(c+=`<br><em>+ 하치마키</em>`),i+=`<div class="day ${o<n?`got`:``} ${s?`today`:``} ${o===6?`big`:``}"><small>${o+1}일차</small><div>${c}</div>${o<n?`<b class="chk">받음</b>`:``}</div>`});let a=this.open(`<h2>7일 출석 보상</h2><p class="sub">매일 들러서 보상을 받아요 (${e.attend.day}일째 출석)</p><div class="cal">${i}</div>
      <button class="big-btn" id="a-claim" ${t?``:`disabled`}>${t?`오늘 보상 받기`:`내일 또 만나요`}</button>`,`attend`);Q(`#a-claim`,a).onclick=e=>{let t=e.currentTarget,n=this.app.claimAttend();n&&(n.pearls&&this.flyReward(t,`pearl`,8),n.money&&this.flyReward(t,`coin`,8),this.openAttend())}}openPerks(){let e=this.app.p,t=``;for(let n of yf){let r=e.perks[n.id]||0,i=this.app.perkCost(n),a=r>=n.max,o=Array.from({length:n.max},(e,t)=>`<i class="${t<r?`on`:``}"></i>`).join(``);t+=`<div class="up-row"><div class="up-ic ic-plate">${Z.up2}</div><div class="up-info"><b>${n.name}</b><small>${n.desc}</small><div class="pips">${o}</div></div>
        <button class="btn buy" data-id="${n.id}" ${a||e.pearls<i?`disabled`:``}>${a?`MAX`:`<span class="ic">${Z.pearl}</span>${i}`}</button></div>`}let n=e.finished?`<div class="season"><b>${e.season+1}시즌 도전</b><small>1호점부터 다시 시작해요. 영구 강화와 코스튬은 유지되고 모든 수익이 x${(1+e.season*.5).toFixed(1)}, 진주 +100</small><button class="big-btn" id="pk-season">새 시즌 시작</button></div>`:`<p class="hint">우주 정거장까지 완성하면 수익 배율이 오른 다음 시즌에 도전할 수 있어요 (현재 ${e.season}시즌)</p>`,r=this.open(`<h2>영구 강화</h2><p class="sub">진주로 사면 모든 식당에서 계속 유지돼요</p><div class="money-line"><span class="ic">${Z.pearl}</span><b>${e.pearls}</b></div><div class="up-list">${t}</div>${n}`,`perks`);r.querySelectorAll(`.buy`).forEach(e=>e.addEventListener(`click`,()=>{this.app.buyPerk(e.dataset.id)&&this.openPerks()}));let i=r.querySelector(`#pk-season`);i&&(i.onclick=()=>this.confirm(`새 시즌을 시작할까요? 식당은 1호점부터 다시 시작해요.`,()=>this.app.startSeason()))}openDex(){let e=this.app.p;this.app.newDex=!1;let t=``,n=0;for(let r of cf){let i=e.dex[r];i&&n++;let a=df.filter(e=>e.layout.menus.includes(r)).map(e=>e.name)[0]||``;t+=`<div class="dx ${i?``:`unk`}">
        <div class="dimg" style="--pc:${sf[r].plate}">${Qf(r)}</div>
        <b>${i?sf[r].name:`???`}</b>
        <small>${i?sf[r].desc:a+`에서 발견`}</small>
        ${i?`<em>${i.served}접시 판매 · ${sf[r].price}원~</em>`:``}
      </div>`}this.open(`<h2>레시피 도감</h2><p class="sub">발견한 메뉴 ${n} / ${cf.length}</p><div class="dex">${t}</div>`,`dexp`)}openCostume(e=`hat`){let t=this.app.p,n=t.cos,r=[[`hat`,`모자`],[`apron`,`앞치마`],[`skin`,`인테리어`]],i=e===`hat`?mf:e===`apron`?hf:pf,a=e===`hat`?n.hats:e===`apron`?n.aprons:n.skins,o=e===`hat`?n.hat:e===`apron`?n.apron:n.skin,s=``;for(let n of i){let r=a.includes(n.id),i=o===n.id;s+=`<div class="cs ${i?`on`:``} ${r?``:`lock`}">
        <div class="cprev">${Cm(e,n)}</div>
        <b>${n.name}</b>
        <button class="btn cbuy" data-id="${n.id}" ${!r&&t.pearls<n.price?`disabled`:``}>${i?`착용 중`:r?`착용`:`<span class="ic">${Z.pearl}</span>${n.price}`}</button>
      </div>`}let c=this.open(`<h2>코스튬</h2><div class="tabs">${r.map(([t,n])=>`<button class="tab ${t===e?`on`:``}" data-tab="${t}">${n}</button>`).join(``)}</div>
      <div class="money-line"><span class="ic">${Z.pearl}</span><b>${t.pearls}</b></div>
      <div class="cgrid">${s}</div>`,`costume`);c.querySelectorAll(`.tab`).forEach(e=>e.addEventListener(`click`,()=>{J.play(`click`),this.openCostume(e.dataset.tab)})),c.querySelectorAll(`.cbuy`).forEach(t=>t.addEventListener(`click`,()=>{this.app.buyCostume(e,t.dataset.id),this.openCostume(e)}))}openAch(){let e=this.app.p,t=this.app.meta,n=``,r=gf.slice().sort((t,n)=>(e.ach[t.id]===1?0:e.ach[t.id]===2?2:1)-(e.ach[n.id]===1?0:e.ach[n.id]===2?2:1));for(let i of r){let r=e.ach[i.id]||0,a=Math.min(i.goal,t.achValue(i));n+=`<div class="ach ${r===2?`claimed`:r===1?`done`:``}">
        <div class="ai">${Z.trophy}</div>
        <div class="at"><b>${i.name}</b><small>${i.desc}</small><div class="bar"><i style="width:${a/i.goal*100}%"></i></div></div>
        <button class="btn claim" data-id="${i.id}" ${r===1?``:`disabled`}>${r===2?`완료`:`<span class="ic">${Z.pearl}</span>${i.reward}`}</button>
      </div>`}let i=gf.filter(t=>e.ach[t.id]).length,a=this.open(`<h2>업적</h2><p class="sub">${i} / ${gf.length} 달성 <button class="link" id="ach-stats">통계 보기</button></p><div class="achs">${n}</div>`,`achp`);a.querySelectorAll(`.claim`).forEach(e=>e.addEventListener(`click`,()=>{let n=t.claimAch(e.dataset.id);n&&(this.flyReward(e,`pearl`,Math.min(12,4+Math.floor(n/3))),this.app.save(),this.toast(`진주 +${n}`,`good`),this.openAch())})),Q(`#ach-stats`,a).onclick=()=>this.openStats()}openStats(){let e=this.app.p,t=e.stats,n=this.app.game,r=Math.floor(t.playSec),i=[[`판매한 초밥`,`${wp(t.plates)}접시`],[`접대한 손님`,`${wp(t.customers)}명`],[`누적 수익`,wp(t.earned)],[`최고 콤보`,t.maxCombo],[`VIP 세트 완료`,t.vip],[`설거지한 접시`,wp(t.washed)],[`수거한 마른 접시`,t.dried],[`화나서 떠난 손님`,t.angry],[`러시 타임 버틴 횟수`,t.rushes],[`최고 별점`,(t.bestStars||0).toFixed(1)],[`오프라인 수익`,wp(t.offline)],[`플레이 시간`,`${Math.floor(r/3600)}시간 ${Math.floor(r%3600/60)}분`]],a=``;e.records.forEach((e,t)=>{a+=`<div class="rec"><b>${t+1}호점 · ${df[t]?.name||``}</b><span>수익 ${wp(e.earned)} · 손님 ${wp(e.cust)} · 별 ${(e.stars||0).toFixed(1)} · ${Math.round((e.time||0)/60)}분</span></div>`}),a+=`<div class="rec cur"><b>${e.stage+1}호점 · ${n.stage.name} (영업 중)</b><span>수익 ${wp(n.run.earned)} · 손님 ${wp(n.run.cust)} · 별 ${n.stars().toFixed(1)}</span></div>`,this.open(`<h2>통계</h2><div class="stats">${i.map(([e,t])=>`<div><span>${e}</span><b>${t}</b></div>`).join(``)}</div><h3>식당 기록</h3><div class="recs">${a}</div>`,`statsp`)}openOffline(e,t,n,r){let i=Math.floor(t/3600),a=Math.floor(t%3600/60),o=this.open(`<div class="off-ic">${Z.coin}</div><h2>자리를 비운 동안 벌었어요</h2>
      <p class="sub">${i?i+`시간 `:``}${a}분 동안 직원들이 영업했어요</p>
      <div class="off-amt"><span class="ic">${Z.coin}</span>${wp(e)}</div>
      <div class="col">
        <button class="big-btn" id="o-2x" ${n?``:`disabled`}>2배 받기 <small>${n?`오늘 1회 무료`:`내일 다시 가능`}</small></button>
        <button class="btn" id="o-1x">그냥 받기</button>
      </div>`,`offline`,null,{noClose:!0,noBackdrop:!0});Q(`#o-2x`,o).onclick=e=>{this.flyReward(e.currentTarget,`coin`,14),this.close(!0),r(2)},Q(`#o-1x`,o).onclick=e=>{this.flyReward(e.currentTarget,`coin`,8),this.close(!0),r(1)}}openResult(e,t,n){let r=df[e.stage+1],i=this.open(`<div class="res-top"><div class="stamp">${t?`전설의 셰프`:`영업 성공`}</div></div>
      <h2>${e.name} 졸업!</h2>
      <div class="stats res">
        <div><span>총 수익</span><b data-n="${e.earned}" data-f="k">0</b></div>
        <div><span>접대한 손님</span><b data-n="${e.cust}" data-s="명">0</b></div>
        <div><span>최종 별점</span><b data-n="${e.stars}" data-d="1">0</b></div>
        <div><span>최고 콤보</span><b data-n="${e.bestCombo}">0</b></div>
        <div><span>영업 시간</span><b data-n="${Math.max(1,Math.round(e.time/60))}" data-s="분">0</b></div>
        <div class="rw"><span>보상</span><b><span class="ic">${Z.pearl}</span><em data-n="${e.pearls}">0</em></b></div>
      </div>
      ${t?`<p class="sub">우주 최고의 회전초밥집을 완성했어요! 계속 영업하며 기록을 늘려보세요.</p>`:`<p class="sub">다음 식당: <b>${r.name}</b><br>${r.sub}</p>`}
      <button class="big-btn" id="r-next">${t?`계속 영업하기`:`새 식당으로 이전!`}</button>`,`result`,null,{noClose:!0,noBackdrop:!0}),a=[...i.querySelectorAll(`[data-n]`)],o=performance.now()+350,s=!1,c=()=>{if(!i.isConnected)return;let e=!0;if(a.forEach((t,n)=>{let r=o+n*180,i=Math.max(0,Math.min(1,(performance.now()-r)/700));i<1&&(e=!1);let a=1-(1-i)**3,s=+t.dataset.n*a;t.textContent=(t.dataset.f===`k`?wp(s):t.dataset.d?s.toFixed(1):String(Math.round(s)))+(t.dataset.s||``),i>0&&i<1&&Math.random()<.25&&J.play(`pay`)}),e&&!s){s=!0;let e=i.querySelector(`.rw`);e.classList.add(`rwpop`),this.flyReward(e,`pearl`,10);return}requestAnimationFrame(c)};requestAnimationFrame(c),Q(`#r-next`,i).onclick=()=>{this.close(!0),n()}}};function Cm(e,t){if(e===`apron`)return`<svg viewBox="0 0 48 48"><path d="M14 8h20v8l6 4v22H8V20l6-4z" fill="${t.color}" stroke="#333" stroke-width="2"/><path d="M14 8q10 8 20 0" fill="none" stroke="#333" stroke-width="2"/><rect x="18" y="26" width="12" height="8" rx="2" fill="none" stroke="#333" stroke-width="2"/></svg>`;if(e===`skin`){let e=t.over;return`<svg viewBox="0 0 48 48"><rect x="4" y="18" width="40" height="26" rx="3" fill="${e.floorTint||`#e2c08c`}" stroke="#333" stroke-width="2"/><rect x="8" y="4" width="32" height="16" fill="${e.noren||`#23407a`}" stroke="#333" stroke-width="2"/><circle cx="24" cy="12" r="4" fill="#fff"/><circle cx="10" cy="30" r="5" fill="${e.lantern||`#ff5a3c`}" stroke="#333" stroke-width="2"/><rect x="18" y="28" width="22" height="8" rx="4" fill="${e.counter||`#d8a86a`}" stroke="#333" stroke-width="2"/></svg>`}return`<svg viewBox="0 0 48 48"><circle cx="24" cy="34" r="11" fill="#ffd9b8" stroke="#333" stroke-width="2"/>${{chef:`<ellipse cx="24" cy="16" rx="14" ry="10" fill="#fff" stroke="#333" stroke-width="2"/><rect x="13" y="20" width="22" height="10" fill="#fff" stroke="#333" stroke-width="2"/>`,band:`<rect x="8" y="22" width="32" height="7" rx="3" fill="#fff" stroke="#333" stroke-width="2"/><circle cx="24" cy="25" r="3.5" fill="#e2394f"/>`,cat:`<path d="M10 30l4-18 8 12zM38 30l-4-18-8 12z" fill="#ff9a3c" stroke="#333" stroke-width="2" stroke-linejoin="round"/>`,pirate:`<path d="M4 28q20-22 40 0z" fill="#2a2a2e" stroke="#333" stroke-width="2"/><rect x="20" y="16" width="8" height="6" fill="#fff"/>`,crown:`<path d="M8 32l3-18 7 8 6-12 6 12 7-8 3 18z" fill="#ffc83d" stroke="#8a5a00" stroke-width="2" stroke-linejoin="round"/>`,helmet:`<circle cx="24" cy="24" r="16" fill="#bfe8ff" stroke="#333" stroke-width="2" opacity=".85"/><circle cx="18" cy="18" r="4" fill="#fff"/>`}[t.id]||``}</svg>`}var wm=new URLSearchParams(location.search).has(`debug`),$={p:null,game:null,meta:null,ui:null,pauseReasons:new Set([`title`]),speed:1,newDex:!1,saveT:0,hiddenAt:0,started:!1,W:()=>U.width,H:()=>U.height,setPaused(e,t){e?this.pauseReasons.add(t):this.pauseReasons.delete(t),e&&yd()},get paused(){return this.pauseReasons.size>0},save(){this.game&&(this.game.serialize(),this.p.lastSeen=Date.now(),Df(this.p))},haptic(e){if(this.p.settings.haptic)try{navigator.vibrate&&navigator.vibrate(e)}catch{}},toggleMute(){let e=!(this.p.settings.sfx||this.p.settings.bgm);this.p.settings.sfx=e,this.p.settings.bgm=e,J.setSfx(e),J.setBgm(e),this.ui.setMuteIcon(e),this.save()},setSetting(e,t){this.p.settings[e]=t,e===`sfx`&&J.setSfx(t),e===`bgm`&&J.setBgm(t),e===`shadows`&&(Qu(t),this.sessionLowQ=!1),this.ui.setMuteIcon(this.p.settings.sfx||this.p.settings.bgm),this.save()},moneyUnit(){let e=this.game?.pads?.[0],t=e?e.u.cost*.5:50*df[this.p.stage].priceMul;return Math.max(10,Math.round(t))},perkCost(e){return e.base+e.step*(this.p.perks[e.id]||0)},perkAffordable(){return yf.some(e=>(this.p.perks[e.id]||0)<e.max&&this.p.pearls>=this.perkCost(e))},buyPerk(e){let t=yf.find(t=>t.id===e),n=this.p.perks[e]||0;return!t||n>=t.max||this.p.pearls<this.perkCost(t)?(J.play(`error`),!1):(this.p.pearls-=this.perkCost(t),this.p.perks[e]=n+1,this.game.applyUpgrades(),J.play(`unlock`),this.ui.toast(`${t.name} Lv.${n+1}!`,`good`),this.save(),!0)},recommendUpgrade(){let e=this.game,t=e.bneck||{},n=[];(t.rack||0)>8&&n.push(`plates`),(t.full||0)>8&&n.push(`cap`),(t.cook||0)>8&&n.push(`cook`),(t.wait||0)>8&&n.push(`belt`),n.push(`speed`,`cap`),e.staff.length&&n.push(`sspeed`);for(let t of n){let n=uf.find(e=>e.id===t);if((e.run.upg[t]||0)<n.max&&(!n.needStaff||e.staff.length))return t}return null},startSeason(){let e=this.p;this.ui.curtain(()=>{e.season=(e.season||1)+1,e.stage=0,e.run=xf(),e.finished=!1,e.pearls+=100,this.game.loadStage(),this.save(),setTimeout(()=>this.ui.banner(`${e.season}시즌 시작!`,`모든 수익 x${(1+(e.season-1)*.5).toFixed(1)}`,null),700)},`${(e.season||1)+1}시즌`)},upgCost(e){let t=this.p.run.upg[e.id]||0;return Math.round(e.base*e.growth**+t*df[this.p.stage].priceMul*(1+((this.p.season||1)-1)*.5))},buyUpgrade(e){let t=uf.find(t=>t.id===e),n=this.p.run,r=n.upg[e]||0;if(!t||r>=t.max)return!1;let i=this.upgCost(t);return n.money<i?(J.play(`error`),!1):(n.money-=i,n.upg[e]=r+1,e===`plates`&&(this.game.rack.n+=X.platesPerLvl),this.game.applyUpgrades(),J.play(`unlock`),this.haptic(25),this.ui.toast(`${t.name} Lv.${r+1}!`),this.save(),!0)},buyCostume(e,t){let n=this.p.cos,r=e===`hat`?mf:e===`apron`?hf:pf,i=e===`hat`?n.hats:e===`apron`?n.aprons:n.skins,a=r.find(e=>e.id===t);if(a){if(i.includes(t))J.play(`click`);else{if(this.p.pearls<a.price){J.play(`error`);return}this.p.pearls-=a.price,i.push(t),J.play(`unlock`),this.ui.toast(`${a.name} 획득!`)}if(e===`hat`)n.hat=t;else if(e===`apron`)n.apron=t;else{let e=n.skin!==t;n.skin=t,e&&(this.save(),this.ui.close(!0),this.ui.curtain(()=>{this.game.loadStage(),this.game.refreshCostume()},a.name))}this.game.refreshCostume(),this.save()}},claimAttend(){let e=this.meta.attendClaim(this.moneyUnit());if(!e)return null;e.money&&this.game.addMoney(e.money),J.play(`unlock`);let t=[];return e.pearls&&t.push(`진주 +${e.pearls}`),e.money&&t.push(`돈 +${wp(e.money)}`),e.hat&&t.push(`하치마키 모자 획득!`),this.ui.toast(`${e.day}일차 보상: ${t.join(`, `)}`),this.save(),e},stageClear(e){let t=this.game,n=this.p,r={stage:n.stage,name:t.stage.name,earned:t.run.earned,cust:t.run.cust,stars:t.stars(),bestCombo:t.run.bestCombo||n.stats.maxCombo,time:t.run.time,pearls:20+n.stage*15};n.records[n.stage]={earned:r.earned,cust:r.cust,stars:r.stars,time:r.time},n.pearls+=r.pearls,this.save(),this.ui.openResult(r,e,()=>{if(e){n.finished=!0,this.save();return}let r=Math.min(df.length-1,n.stage+1);this.ui.curtain(()=>{n.stage=r,n.run=xf(),n.stats.stage=n.stage+1,this.meta.checkAch(),t.loadStage(),this.save(),setTimeout(()=>this.ui.banner(`${n.stage+1}호점 오픈!`,df[n.stage].name,null),700)},df[r].name)})},restartStage(){this.ui.curtain(()=>{this.p.run=xf(),this.game.loadStage(),this.save(),this.ui.toast(`식당을 새로 시작했어요`)},df[this.p.stage].name)},wipeAll(){Of(),this.p=null,location.reload()},toTitle(){this.save(),this.setPaused(!0,`title`),J.holdBgm(!0),document.getElementById(`app`).classList.add(`at-title`),this.ui.showTitle(()=>this.startPlay())},startPlay(){J.resume(),J.startBgm(),this.setPaused(!1,`title`),J.holdBgm(!1),document.getElementById(`app`).classList.remove(`at-title`),this.started||(this.started=!0,this.checkOffline(this.p.lastSeen),this.meta.attendAvailable()&&this.p.stats.plates>0&&setTimeout(()=>this.meta.attendAvailable()&&this.ui.toast(`오늘의 출석 보상이 있어요! 왼쪽 출석 버튼을 눌러요`,`good`),12e3))},checkOffline(e){let t=(Date.now()-e)/1e3;if(!(t>=X.offline.minSec))return;let n=Math.min(t,X.offline.capHours*3600+(this.p.perks.offline||0)*1800),r=this.game.idleRate(),i=this.game.pads[0],a=(i?i.u.cost:400*df[this.p.stage].priceMul)*1.2,o=Math.floor(Math.min(r*n,a));if(o<1){this.p.stats.plates>20&&this.ui.toast(`직원을 고용하면 자리를 비운 동안에도 돈을 벌어요`);return}let s=this.p.doubleDay!==bf();this.ui.openOffline(o,n,s,e=>{e===2&&(this.p.doubleDay=bf());let t=o*e;this.game.addMoney(t),this.p.stats.offline+=t,this.meta.stat(`offline`,0),J.play(`cash`);for(let e=0;e<8;e++)setTimeout(()=>J.play(`coin`),e*60);this.ui.flashMoney(),this.save()})},tutStep(){return this.p.tut},tutEvent(e){let t=this.p.tut;({0:`pick`,1:`deposit`,2:`dish`,3:`feed`,4:`money`,5:`unlock`})[t]===e&&(this.p.tut=t+1,J.play(`happy`),this.p.tut===6&&this.ui.toast(`잘했어요! 이제 가게를 쭉쭉 키워봐요`),this.save())},loopTarget(){let e=this.game,t=e.chef,n=e=>e&&{x:e.x,z:e.z};if(t.stack.some(e=>e.k===`dish`)){let t=e.belts.find(e=>e.built&&e.free()>0);if(t)return n(t.feed)}let r=t.stack.find(e=>e.k===`ing`);if(r)return n(Object.values(e.stations).find(e=>e.built&&e.ing===r.id)?.padIn);let i=Object.values(e.stations).find(e=>e.built&&e.out>0);if(i)return n(i.padOut);let a=Object.values(e.stations).find(e=>e.built&&e.inp>0);if(a)return n(a.padOut);let o=Object.values(e.stations).find(e=>e.built&&e.crateN>0);return o?n(o.crate.pad):null},tutState(){let e=this.game,t=this.p.tut,n=e.seats.find(e=>e.money>0),r=e.seats.find(e=>e.cust&&(e.cust.state===`eat`||e.cust.state===`fetch`)),i=e.pads[0],a=i?i.u.cost-i.paid-Math.floor(e.run.money):0,o=new Set;for(let t of e.belts)for(let e of t.slots)e.item&&!e.item.dried&&o.add(e.item.m);return{t,money:n,eating:r,pad:i,short:a,waiting:e.seats.find(e=>e.cust&&e.cust.state===`wait`&&o.has(e.cust.orders[e.cust.oi]))}},tutTarget(){let e=this.p.tut,t=this.game;if(e<6&&t.done.size>=2&&(this.p.tut=6),this.p.tut>=6||t.p.stage>0)return this.hintTarget();let n=Object.values(t.stations).find(e=>e.built),r=this.tutState();switch(e){case 0:return n&&{x:n.crate.pad.x,z:n.crate.pad.z};case 1:return n&&{x:n.padIn.x,z:n.padIn.z};case 2:return n&&n.out===0&&n.inp===0&&!t.chef.stack.some(e=>e.k===`ing`)?{x:n.crate.pad.x,z:n.crate.pad.z}:n&&n.out===0&&n.inp===0?{x:n.padIn.x,z:n.padIn.z}:n&&{x:n.padOut.x,z:n.padOut.z};case 3:return t.chef.stack.some(e=>e.k===`dish`)?{x:t.belts[0].feed.x,z:t.belts[0].feed.z}:n&&{x:n.padOut.x,z:n.padOut.z};case 4:return r.money?{x:r.money.zone.x,z:r.money.zone.z}:r.eating?{x:r.eating.zone.x,z:r.eating.zone.z}:r.waiting?{x:r.waiting.zone.x,z:r.waiting.zone.z}:this.loopTarget();case 5:return r.short>0?r.money?{x:r.money.zone.x,z:r.money.zone.z}:this.loopTarget():r.pad?{x:r.pad.x,z:r.pad.z}:null}return null},tutText(){let e=this.p.tut,t=this.game;if(e>=6||t.p.stage>0)return null;let n=this.tutState();return e===4?n.money?`손님이 두고 간 돈을 밟아서 챙겨요`:n.eating?`손님이 먹는 중이에요! 다 먹으면 돈을 두고 가요`:n.waiting?`손님이 초밥을 집어 갈 거예요. 자리 옆에서 기다려요`:`초밥을 더 만들어 벨트에 올려요`:e===5?n.short>0&&n.money?`손님 자리의 돈을 챙겨요`:n.short>0?`초밥을 한 접시 더 팔아 ${n.short}원을 모아요`:`초록 발판에 서 있으면 새 좌석이 열려요`:[`드래그해서 이동! 노란 생선 상자 발판을 밟아요`,`조리대 파란 발판에 재료를 넣어요`,`완성된 초밥을 보라 발판에서 챙겨요`,`초록 투입구 발판에서 벨트에 올려요`][e]},hintTarget(){let e=this.game,t=e.chef,n=e=>e&&{x:e.x,z:e.z};if(e.rack.n===0&&e.sink.built){if(t.stack.some(e=>e.k===`dirty`))return n(e.sink.pad);let r=e.seats.find(e=>e.dirty>0&&!e.cust);if(r)return n(r.zone)}if((this.idleT||0)<3.5)return null;let r=e.pads[0];if(r&&e.run.money+r.paid>=r.u.cost)return n(r);if(t.stack.some(e=>e.k===`dish`)){let t=e.belts.find(e=>e.built&&e.free()>0);if(t)return n(t.feed)}let i=e.seats.find(e=>e.money>0);if(i)return n(i.zone);let a=t.stack.find(e=>e.k===`ing`);if(a)return n(Object.values(e.stations).find(e=>e.built&&e.ing===a.id)?.padIn);let o=e.demand(),s=Object.values(e.stations).find(e=>e.built&&e.out>0&&(o[e.menu]||0)>0);if(s)return n(s.padOut);let c=Object.values(e.stations).find(e=>e.built&&(o[e.menu]||0)>0&&e.inp===0);return c?n(c.crate.pad):t.stack.some(e=>e.k===`dirty`)&&e.sink.built?n(e.sink.pad):null}};function Tm(){let{profile:e,corrupt:t}=Ef();$.p=e,Zu(document.getElementById(`gl`)),Qu(e.settings.shadows),J.setSfx(e.settings.sfx),J.setBgm(e.settings.bgm),$.meta=new bm(e,{missionDone:e=>$.ui&&$.ui.toast(`미션 완료! ${e.text}`,`good`),achDone:e=>$.ui&&$.ui.toast(`업적 달성: ${e.name}`,`good`)}),$.ui=new Sm($),$.game=new ym(e,{stat:(e,t)=>$.meta.stat(e,t),toast:(e,t)=>$.ui.toast(e,t),banner:(e,t,n)=>$.ui.banner(e,t,n),haptic:e=>$.haptic(e),openUpgrade:()=>$.ui.openUpgrade(),closeUpgrade:()=>$.ui.panel&&$.ui.panel.cls===`upgrade`&&$.ui.close(),stageClear:e=>$.stageClear(e),save:()=>$.save(),money:e=>e>0&&$.ui.flashMoney(),combo:(e,t)=>{$.ui.combo(e,t),e>($.game.run.bestCombo||0)&&($.game.run.bestCombo=e)},comboBreak:()=>$.ui.comboBreak(),emote:(e,t)=>$.ui.emote(e,t),discover:e=>{$.meta.discover(e)&&($.newDex=!0,$.ui.toast(`새 레시피 발견! ${sf[e].name}`,`good`))},served:e=>$.meta.served(e),tut:e=>$.tutEvent(e),tutTarget:()=>$.tutTarget(),unlocked:e=>{$.tutEvent(`unlock`),e.t===`sink`&&$.ui.toast(`빈 접시를 설거지대에 가져가면 다시 쓸 수 있어요`),e.t===`staff`&&$.ui.toast(e.role===`runner`?`운반 직원이 접시를 나르고 치워요`:`조리 직원이 재료를 채워줘요`),e.t===`lever`&&$.ui.toast(`두 번째 벨트 오픈! 투입구가 하나 더 생겼어요`),e.t===`extend`&&$.ui.toast(`벨트가 길어졌어요! 좌석을 더 놓을 수 있어요`),e.t===`upgrade`&&$.ui.toast(`보라색 책상 앞 발판에서 업그레이드해요`)},clearWorldUI:()=>$.ui.clearWorld(),stageLoaded:()=>{}}),$.game.loadStage(),window.__game=$,window.__gfx=U,window.__input=K,window.__audio=J,window.__UPG=uf,vd(document.getElementById(`gl`)),K.onFirst=()=>J.resume(),t&&setTimeout(()=>$.ui.toast(`저장 데이터가 손상되어 새로 시작해요`,`bad`),800),document.getElementById(`app`).classList.add(`at-title`),$.ui.showTitle(()=>$.startPlay()),window.addEventListener(`resize`,$u),document.addEventListener(`visibilitychange`,()=>{document.hidden?($.hiddenAt=Date.now(),$.setPaused(!0,`hidden`),$.save(),J.suspend()):($.setPaused(!1,`hidden`),$.started&&J.resume(),$.started&&$.hiddenAt&&!$.ui.panel&&$.checkOffline($.hiddenAt),$.hiddenAt=0)}),window.addEventListener(`pagehide`,()=>$.save()),document.addEventListener(`contextmenu`,e=>e.preventDefault()),document.addEventListener(`pointerdown`,()=>J.resume(),{once:!1,passive:!0}),wm&&Mm(),requestAnimationFrame(km)}var Em={js:0,gl:0,calls:0,tris:0};window.__perf=Em;var Dm=performance.now(),Om=0;function km(e){let t=Math.min(.2,Math.max(0,(e-Dm)/1e3));Dm=e;let n=$.game,r=$.paused;if(!r){let e=Math.max(1,Math.ceil(t/.05)),r=e*($.speed>1?$.speed:1),i=performance.now();for(let i=0;i<r;i++)$.bot&&$.bot(t/e),n.update(t/e);jm(),Em.upd=(Em.upd||0)*.9+(performance.now()-i)*.1,$.p.stats.playSec+=t,$.saveT+=t,$.saveT>=X.autosave&&($.saveT=0,$.save())}let i=performance.now();if(n.render(r?0:t),Em.rend=(Em.rend||0)*.9+(performance.now()-i)*.1,$.pauseReasons.has(`title`)){Om+=t;let e=n.lay;td(t,e.belts[0].cx+Math.sin(Om*.25)*2.5,e.topZ+1+Math.cos(Om*.2)*2)}else{let e=n.lay.bounds,r=n.camCut;r?(K.locked=!0,U.zoom+=(.9-U.zoom)*Math.min(1,t*8),td(t,r.x,r.z-.3,!1,9)):(K.locked=!1,U.zoom+=(1-U.zoom)*Math.min(1,t*5),td(t,Math.max(e.x0+3.2,Math.min(e.x1-3.2,n.chef.x)),Math.max(e.z0+5.6,Math.min(e.z1-3.5,n.chef.z-.4)),!1,n.lastCutEnd&&n.time-n.lastCutEnd<.8?8:6))}if($.ui.updateHud(t),$.ui.updateWorld(),Zp(t),r)$.ui.updateEdge(null),$.ui.updatePointer(null,!1);else{$.idleT=K.active?0:($.idleT||0)+t;let e=$.tutText();$.ui.tut(e,$.p.tut===0&&!K.active),$.ui.updateEdge(n.guide),$.ui.updatePointer(n.guide,!!e&&$.p.tut>0)}let a=performance.now();U.renderer.render(U.scene,U.camera);let o=performance.now();Em.js=Em.js*.9+(a-e)*.1,Em.gl=Em.gl*.9+(o-a)*.1,Em.calls=U.renderer.info.render.calls,Em.frame=(Em.frame||16)*.9+t*1e3*.1,Em.tris=U.renderer.info.render.triangles,requestAnimationFrame(km)}var Am={start:0,n:0,sum:0,last:0,step:0};function jm(){let e=performance.now();if(!Am.start){Am.start=e+1500,Am.last=e;return}let t=e-Am.last;if(Am.last=e,e<Am.start||Am.step>=2||(Am.n++,Am.sum+=t,e-Am.start<3e3))return;let n=Am.sum/Am.n;if(Am.start=e,Am.n=0,Am.sum=0,n<40){Am.step=2;return}Am.step===0&&$.p.settings.shadows&&!$.p.settings.qLocked?(Qu(!1),$.sessionLowQ=!0,$.ui.toast(`기기 성능에 맞춰 그림자를 간단하게 바꿨어요 (설정에서 변경 가능)`),Am.step=1):U.renderer.getPixelRatio()>1?(U.renderer.setPixelRatio(1),$u(),Am.step=2):Am.step=2}function Mm(){let e=document.createElement(`div`);e.className=`debug`,e.innerHTML=`
    <button data-a="money">+돈</button>
    <button data-a="speed">x1</button>
    <button data-a="unlock">해금</button>
    <button data-a="rush">러시</button>
    <button data-a="offline">오프라인</button>
    <button data-a="pearl">+진주</button>`,document.getElementById(`app`).appendChild(e),e.addEventListener(`pointerdown`,e=>e.stopPropagation()),e.addEventListener(`click`,e=>{let t=e.target.dataset.a,n=$.game;if(t===`money`){let e=n.pads[0];n.addMoney(Math.max(1e3,e?e.u.cost*2:1e3))}else t===`speed`?($.speed=$.speed===1?5:1,e.target.textContent=`x`+$.speed):t===`unlock`?n.debugUnlockAll():t===`rush`?(n.rushT=9999,n.run.nextRush=1):t===`offline`?($.save(),$.checkOffline(Date.now()-72e5)):t===`pearl`&&($.p.pearls+=200)})}Tm();