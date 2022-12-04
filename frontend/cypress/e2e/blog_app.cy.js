describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Xu You Liu",
      username: "xyl",
      password: "0117",
    };
    const nonAuthor = {
      name: "non-author",
      username: "wrong",
      password: "wrong",
    };
    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.request("POST", "http://localhost:3003/api/users", nonAuthor);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.get("#username");
    cy.get("#password");
    cy.get("#login-button");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("xyl");
      cy.get("#password").type("0117");
      cy.get("#login-button").click();

      cy.contains("Xu You Liu logged-in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("xyl");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();

      cy.contains("Wrong username or password!").should(
        "have.css",
        "color",
        "rgb(255, 0, 0)"
      );
    });
  });
  describe("When logged in", function () {
    beforeEach(function () {
      cy.get("#username").type("xyl");
      cy.get("#password").type("0117");
      cy.get("#login-button").click();
    });

    it("A blog can be created", function () {
      cy.contains("create new blog").click();
      cy.get("#title").type("a blog can be added");
      cy.get("#author").type("xyl");
      cy.get("#url").type("www.xyl.com");
      cy.get("#create-button").click();

      cy.contains('"a blog can be added" by xyl is added to blog list');
    });
    describe("and a blog existed", function () {
      beforeEach(function () {
        cy.contains("create new blog").click();
        cy.get("#title").type("a blog can be added");
        cy.get("#author").type("xyl");
        cy.get("#url").type("www.xyl.com");
        cy.get("#create-button").click();
      });
      it("the blog can be liked", function () {
        cy.get("#view-button").click();
        cy.get("#like-button").click();

        cy.contains('"a blog can be added" by xyl is liked!');
      });
      it("author can delete the blog", function () {
        cy.get("#view-button").click();
        cy.get("#delete-button").click();

        cy.contains('"a blog can be added" by xyl is deleted successfully!');
      });
      it("non-author can not delete the blog", function () {
        cy.get("#logout-button").click();
        cy.get("#username").type("wrong");
        cy.get("#password").type("wrong");
        cy.get("#login-button").click();

        cy.get("#view-button").click();
        cy.get("#delete-button").should("have.css", "display", "none");
      });
      it("blog is ordered by likes", function () {
        cy.contains("create new blog").click();
        cy.get("#title").type("this is the most liked blog");
        cy.get("#author").type("xyl");
        cy.get("#url").type("www.wrong.com");
        cy.get("#create-button").click();

        cy.visit("http://localhost:3000");

        cy.get(".default").eq(0).should("contain", "a blog can be added");
        cy.get(".default")
          .eq(1)
          .should("contain", "this is the most liked blog");

        cy.contains("this is the most liked blog").contains("view").click();
        cy.contains("www.wrong.com").contains("like").click();

        cy.visit("http://localhost:3000");

        cy.get(".default")
          .eq(0)
          .should("contain", "this is the most liked blog");
        cy.get(".default").eq(1).should("contain", "a blog can be added");
      });
    });
  });
});
