// cypress/e2e/home.cy.ts

describe("Home Page", () => {
  it("should load and display the site title", () => {
    cy.visit("/");
    cy.contains("Pet Cheap").should("be.visible");
  });

  it("should navigate to Products page", () => {
    cy.visit("/");
    cy.contains("Products").click();
    cy.url().should("include", "/products");
    cy.contains("Products").should("be.visible");
  });

  // Add more tests for login, cart, etc. as needed
});
