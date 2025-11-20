import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PageWrapper,
  Layout,
  Main,
  MainHeader,
  PrimaryButton,
} from "./style";

const StepPaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const status = params.get("status");
  const code = params.get("code");
  const reason = params.get("reason");

  const success = status === "success";

  return (
    <PageWrapper>
      <Layout>
        <Main>
          <MainHeader>
            {success ? "Thanh toán thành công" : "Thanh toán thất bại"}
          </MainHeader>

          <div
            style={{
              marginTop: 20,
              background: success ? "#ecfdf5" : "#fef2f2",
              border: success ? "1px solid #bbf7d0" : "1px solid #fecaca",
              borderRadius: 12,
              padding: 20,
              fontSize: 15,
              lineHeight: "23px",
              color: success ? "#065f46" : "#b91c1c",
            }}
          >
            {success ? (
              <>
                Cảm ơn bạn đã thanh toán! <br />
                Lịch hẹn của bạn đã được xác nhận.  
                <br />
                Mã giao dịch: <b>#{code}</b>
              </>
            ) : (
              <>
                Rất tiếc, giao dịch không thành công.  
                <br />
                {reason && <span>Lý do: <b>{reason}</b></span>}
              </>
            )}
          </div>

          <div style={{ marginTop: 26, textAlign: "center" }}>
            <PrimaryButton onClick={() => navigate("/")}>
              Quay về trang chủ
            </PrimaryButton>
          </div>
        </Main>
      </Layout>
    </PageWrapper>
  );
};

export default StepPaymentResult;
