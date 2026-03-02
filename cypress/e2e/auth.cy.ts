/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
describe("Auth (demo)", () => {
  it("Home -> Register renders", () => {
    cy.visit("/");

    // il y a 2 boutons "Create account" => on prend le 1er (header)
    cy.findAllByRole("button", { name: /create account/i }).first().click();

    cy.url().should("include", "/register");
    cy.findByRole("heading", { name: /create your account/i }).should("be.visible");
  });

  it("Register shows validation errors when invalid", () => {
    cy.visit("/register");

    cy.get('[data-cy="register-submit"]').click();
    cy.findByRole("alert").should("be.visible");

    cy.get('[data-cy="register-email"]').type("not-an-email");
    cy.get('[data-cy="register-submit"]').click();
    cy.findByText(/valid email/i).should("be.visible");
  });

  it("Register succeeds and redirects to dashboard", () => {
    cy.visit("/register");

    cy.get('[data-cy="register-name"]').type("Alex Martin");
    cy.get('[data-cy="register-email"]').type(`alex+${Date.now()}@test.com`);
    cy.get('[data-cy="register-password"]').type("Password12345");
    cy.get('[data-cy="register-confirm"]').type("Password12345");
    cy.get('[data-cy="register-terms"]').check();

    cy.get('[data-cy="register-submit"]').click();

    cy.url().should("include", "/console/dashboard");
    cy.contains("Students").should("be.visible");
  });

  it("Login succeeds and redirects to dashboard", () => {
    cy.visit("/login");

    cy.findByRole("heading", { name: /welcome back/i }).should("be.visible");

    cy.get('[data-cy="login-email"]').type("teacher@university.org");
    cy.get('[data-cy="login-password"]').type("demo-demo-1234");
    cy.get('[data-cy="login-submit"]').click();

    cy.url().should("include", "/console/dashboard");
    cy.contains("Students").should("be.visible");
  });
});