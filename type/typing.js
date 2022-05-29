const freeze = obj => Object.freeze(obj);

const Type = require('argtyper').type
const TypeDef = require('argtyper').typedef
const TypeAll = require('argtyper').typeAll
const { typeCheck } = require('type-check')


function checkTypes(value, name) {
  if (typeCheck(value, name) === false) {
    throw TypeError(`Type of Value: { ${name} } is not assignable to Type: { ${value} }`) 
  }
}

function checkFuncTypes(value) {
  return Type(value)
}

function defineType(value) {
  return TypeDef(value)
}

function defineTypeAll(value) {
  return TypeAll(value)
}

function Implements(interface, _descriptors, _class){
    var property = Object.getOwnPropertyNames(interface),
        descriptors = Object.getOwnPropertyDescriptors(interface),
        errMsg = `${_class} wrongly implements interface,`;

    property.map(prop => {
      if(_descriptors === undefined){
            throw TypeError(`A val that has a "noProperty" properties, the value cant be retrieved`);
        }
        if(!_descriptors[prop]){
            throw Error(`${errMsg} ${prop} not available on the class`);
        }
        if(typeof descriptors[prop].value() !== typeof _descriptors[prop].value){
            throw TypeError(`${errMsg} type must be ${typeof descriptors[prop].value()}`)
        }
    })
}


// Under Development
function Data(types) {
    const result = {}
    for (let type of types) {
        result[type] = data => ({
            match: fns => fns[type](data),
        })
    }
    return result
}


function Enum(...types) {
  let autoValue = 0
  let typeValues = {};
  types.map((type, value, types) => {
    if (typeof type === "string") {
      autoValue = value + 1
      let upperName = String(type).toUpperCase();
        typeValues[upperName] = freeze({ key: type, value: autoValue});
    } else if (typeof type === "object") {
      const key = Object.keys(type)[0];
      let upperName = String(key).toUpperCase();
      typeValues[upperName] = freeze({ value: type[key] });
    }
    else if (typeof type === "undefined") {
      autoValue = value + 1
      typeValues[key] = freeze({ value: autoValue });
    }
  })
  return freeze(typeValues);
}


module.exports = {
  checkTypes,
  checkFuncTypes,
  defineType,
  defineTypeAll,
  Data,
  Enum,
  Implements
}
