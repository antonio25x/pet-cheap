describe("Products Page", () => {
  it("should load and display products", () => {
    cy.visit("/products");
    cy.contains("Products").should("be.visible");
    cy.get("[data-component-name='Card']").should("have.length.gte", 2);
  });

  it("should add products to cart", () => {
    cy.visit("/products");

    cy.get(
      "[data-testid='button-add-to-cart-premium-dog-food']"
    ).scrollIntoView();

    cy.get("[data-testid='button-add-to-cart-premium-dog-food']").click();

    cy.scrollTo("top");

    cy.get("[data-testid='button-cart']")
      .find("span")
      .contains("1")
      .should("be.visible");

    cy.get("[data-testid='button-add-to-cart-cat-toy-set']").scrollIntoView();

    cy.get("[data-testid='button-add-to-cart-cat-toy-set']").click();

    cy.scrollTo("top");

    cy.get("[data-testid='button-cart']")
      .find("span")
      .contains("2")
      .should("be.visible");

    cy.get("[data-testid='button-cart']").click();
    cy.contains("Premium Cat Food").should("be.visible");
    cy.contains("Interactive Cat Toy").should("be.visible");
    // Close the toast notification if present
    cy.get("[data-component-name='ToastClose']").click({
      multiple: true,
      force: true,
    });
    cy.get("[data-testid='button-proceed-to-checkout']").should("be.visible");
    cy.get("[data-testid='button-continue-shopping-footer']").should(
      "be.visible"
    );
  });
});
