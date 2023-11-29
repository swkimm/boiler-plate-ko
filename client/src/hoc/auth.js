import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_actions";
import { useNavigate } from "react-router-dom"; // React Router v6 사용 시

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // React Router v6의 navigate 함수

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);

        // 로그인하지 않은 상태
        if (!response.payload.isAuth) {
          if (option) {
            navigate("/login"); // 로그인 페이지로 리다이렉트
          }
        } else {
          // 로그인한 상태
          if (adminRoute && !response.payload.isAdmin) {
            navigate("/"); // 어드민이 아니라면 홈으로 리다이렉트
          } else {
            if (option === false) {
              navigate("/"); // 로그인한 사용자는 접근 불가 페이지라면 홈으로 리다이렉트
            }
          }
        }
      });
    }, [dispatch, navigate]);

    return <SpecificComponent {...props} />;
  }

  return AuthenticationCheck;
}
