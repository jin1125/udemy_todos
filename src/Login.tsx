import { Button, FormControl, TextField, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import styles from "./Login.module.css";

const Login: React.FC = (props: any) => {
  //propsでhistoryを受け取る
  const [isLogin, setIsLogin] = useState(true); //ログインか新規登録かの判定
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      //onAuthStateChangedで認証関連に変更があった時に呼び出される
      //ログインに成功したらuserにユーザー情報が入ってくる
      user && props.history.push("/");
      //もしユーザー情報が入ってきてたら"/"に遷移させる
    });
    return () => unSub(); //クリーンナップ関数
  }, [props.history]); //historyに変更があった時のみ発火

  //描画箇所(JSX)
  return (
    <div className={styles.login__root}>
      <h1>{isLogin ? "Login" : "Register"}</h1>
      <br />
      <FormControl> {/* E-mail入力フォーム */}
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          name="email"
          label="E-mail"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <br />
      <FormControl> {/* Password入力フォーム */}
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
          }}
        />
      </FormControl>
      <br />
      <Button　//ログイン or 新規登録ボタン
        variant="contained"
        color="primary"
        size="small"
        onClick={
          isLogin
            ? async () => {
                //ログインの場合
                try {
                  await auth.signInWithEmailAndPassword(email, password);
                  //ログインの処理
                  props.history.push("/"); //上記処理を待ってから"/"に遷移
                } catch (error) {
                  //エラー時の処理
                  alert(error.message);
                }
              }
            : async () => {
                //新規登録の場合
                try {
                  await auth.createUserWithEmailAndPassword(email, password);
                  //新規登録の処理
                  props.history.push("/"); //上記処理を待ってから"/"に遷移
                } catch (error) {
                  //エラー時の処理
                  alert(error.message);
                }
              }
        }
      >
        {isLogin ? "login" : "register"}　{/* ボタンの文字 */}
      </Button>
      <br />
      <Typography align="center">
        <span onClick={() => setIsLogin(!isLogin)}>
          {" "}
          {/* ログインか新規登録かを切り替える */}
          {isLogin ? "Create new account ?" : "Back to login"}
        </span>
      </Typography>
    </div>
  );
};

export default Login;
