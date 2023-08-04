const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthRepository = require("../repositories/auth");

class AuthService {
  authRepository = new AuthRepository();

  // 회원가입 [POST] /auth/join
  join = async (email, password) => {
    const userData = await this.authRepository.getUserDataByEmail(email);

    if (userData) {
      throw new Error("이미 가입된 이메일입니다. 로그인을 해주세요.");
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, process.env.BCRYPT_SALT);

    await this.authRepository.join(email, hashedPassword);

    return { message: "회원가입이 완료되었습니다." };
  };

  // 로그인 [POST] /auth/login
  login = async (email, password) => {
    const userData = await this.authRepository.getUserDataByEmail(email);

    if (!userData) {
      throw new Error("회원정보가 없습니다. 회원가입을 해주세요.");
    }

    const bcryptCompareResult = await bcrypt.compare(password, userData.password);

    if (!bcryptCompareResult) {
      throw new Error("아이디나 비번이 올바르지 않습니다.");
    }

    // jwt 토큰 발급
    const tokenPayload = { id: userData.id };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "7d" });

    return { message: "로그인 성공", token };
  };
}

module.exports = AuthService;
