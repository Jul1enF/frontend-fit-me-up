

const searchObjectKey = (data, keyname) => {
    let foundValue = "test"

    const searchObjectKeyInArray = (array, keyname) => {
        for (let item of array) {
            if (item instanceof Array) {
                searchObjectKeyInArray(item, keyname)
            } else if (typeof item === 'object') {
                searchObjectKeyInObject(item, keyname)
            }
        }
    }

    const searchObjectKeyInObject = (object, keyname) => {
        for (let key in object) {
            if (key == keyname) {
                foundValue = object[key]
                break;
            } else if (object[key] instanceof Array) {
                searchObjectKeyInArray(object[key], keyname)
            }
            else if (typeof object[key] === 'object') {
                searchObjectKeyInObject(object[key], keyname)
            }
        }
    }

    if (Array.isArray(data)) {
        searchObjectKeyInArray(data, keyname)
    } else if (typeof data === "object") {
        searchObjectKeyInObject(data, keyname)
    }

    return foundValue
}

module.exports = { searchObjectKey }