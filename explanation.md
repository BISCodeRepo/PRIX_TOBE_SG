mybatis, thymeleaf 로 하면서 jpa로 작성했던 방식과 구조가 달라졌습니다.

user 폴더를 보면 controller, dao, pojo, service가 존재

구조:
view(resources/templates폴더) -- controller -- service -- dao = mapper(resources/mapper폴더) -- DB

mybatis 방식은 @Mapper 와 resources/mapper의 로직이 자동으로 바인딩 되는 걸로 알고 있습니다.
mybatis 바인딩할때 경로 설정을 자동으로 resources/mapper 하위에서 찾도록 application.properties에 설정했습니다.

pojo는 계층간 데이터 전달용 객체

login, adlogin, registration을 구현할때, dummy용 account 객체를 뷰에 넘긴 후, 해당 객체의 정보를 입력받는 방식으로
작성했는데, 그냥 공부용으로 했던 거라 나중에 불필요 하다 생각되면 그냥 param 전달받는 방식 @RequestParam으로 바꿔도
될 듯 합니다.

그리고 login, adlogin, registration에서 로그인, 회원가입 실패시 실패 메시지를 화면에 전달하고 보여줘야 하는데
그 부분은 구현 안했었고 그 부분 추가 구현 필요