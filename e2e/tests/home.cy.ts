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

  it("should open the shopping cart", () => {
    cy.visit("/");
    cy.get("[data-testid=button-cart]").click();
    cy.contains("Your cart is empty").should("be.visible");
    cy.get("[data-testid=button-continue-shopping]").should("be.visible");
    // TODO: update later to should("be.visible")
    // for now in Dev mode there is a notification hiding it
    cy.get("[data-testid=button-close-cart]").should("exist");
  });

  it("should not have dashboard link when not logged in", () => {
    cy.visit("/");
    cy.get("[data-testid=link-dashboard]").should("not.exist");
  });
});
