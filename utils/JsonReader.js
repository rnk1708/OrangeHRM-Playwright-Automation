const LoginData = require('../testdata/loginData.json');
const MyInfoData = require('../testdata/myInfoData.json');

class JsonReader {

    static login() {
        return LoginData;
    }

    static myInfo() {
        return MyInfoData;
    }

}

module.exports = JsonReader;