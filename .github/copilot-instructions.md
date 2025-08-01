# Copilot Instructions (Short Version)

## Purpose
Copilot must always generate complete, ready-to-use feature code using the project's existing stack/libraries.


## Additional Rule: Honest and Objective Answers

Always answer all user questions and requests honestly and objectively, without the need to justify or agree with the user's opinions or answers. Responses should be direct, factual, and unbiased.


## Universal E-Commerce Vision & Requirements (User Addition)

### Vision & Purpose
- A universal e-commerce website that can be used by any brand to sell any type of product.
- Unlike marketplaces such as Tokopedia, Shopee, or Amazon—the focus is on brand storytelling, company information, and product details.
- Clean, elegant, modern look with default dark mode (similar to xiaomi.com).
- Homepage highlights the brand story, vision, and uniqueness.
- Dedicated pages for company information, team, history, and achievements.
- Product pages show detailed specifications, brand story, curated reviews, video presentations, and product comparison features.
- Core features: shopping cart, checkout, wishlist, order history, product reviews, customer testimonials.
- Smooth transition/interaction animations, innovative UX, and intuitive navigation.
- Flexible and easily customizable platform for any brand and product.
- Avoid crowded/generic appearance, prioritize brand storytelling.
- Use the stack, components, and structure already present in the project.
- Follow Next.js best practices and ensure all features are ready to use immediately.

### Implementation Principles
- All features must be immediately usable and connected to existing components.
- Do not add new libraries without permission.
- Default to dark mode and minimalist design.
- Animations and UX innovation on main sections (brand story, product, testimonial).
- Brief testing and documentation for complex logic.

---


## E-Commerce Project Vision & Feature Guidelines

**Purpose:**  
Build a universal e-commerce website that empowers brands to sell any product, while focusing on brand storytelling and product information. The site should avoid the cluttered look of typical marketplaces (Tokopedia, Shopee, Amazon) and instead offer a clean, elegant, and modern experience—similar to xiaomi.com.

### Key Principles

1. **Brand-Centric Design**
   - Homepage highlights the brand story, vision, and unique selling points.
   - Provide dedicated sections for company information, team, history, and achievements.
   - Product pages offer detailed information, including specifications, brand story, and curated reviews.

2. **Minimalist & Modern UI**
   - Default to dark mode.
   - Use a clean, spacious layout with clear typography.
   - Avoid excessive product listings, ads, or categories.
   - Prioritize visual storytelling with high-quality images and videos.

3. **Universal & Flexible**
   - The platform should be usable by any brand, regardless of product type.
   - All features must be generic and easily customizable.

4. **Complete E-Commerce Features**
   - Shopping cart, checkout, wishlist, order history, and product reviews.
   - Simple, intuitive navigation.

5. **Innovative UX**
   - Smooth animations for transitions and interactions.
   - “Brand Story” section with animated reveals.
   - Product comparison feature.
   - Video presentations for brands/products.
   - Curated customer testimonials and reviews.

6. **Next.js Best Practices**
   - Follow Next.js conventions for routing, server/client components, and folder structure.
   - Reuse existing components and utilities.
   - Do not add new libraries without permission.

7. **Documentation & Testing**
   - Add brief code comments for complex logic.
   - Include unit tests as per project standards.

---

**Note:**  
Always prioritize brand information and storytelling, not just product listings. The site should feel exclusive, informative, and visually engaging—never crowded or generic.

## Main Rules

1. **Complete Features**
   - Implement every required part: UI, logic, API, validation, routing, etc.
   - Update all relevant files so the feature works immediately.

12. **Honest and Objective Answers**
   - Copilot must always provide honest and objective answers, without the need to justify or agree with the user's opinions or answers.

2. **Use Existing Stack/Libraries**
   - Always use the frameworks, UI kits, state management, etc. already in the project.
   - Do not add new libraries without permission.
   - Follow project structure and conventions.

3. **Reuse Existing Components/Functions**
   - Always use available components/functions.
   - Check shared component collections, helpers, and utilities before creating new ones.

4. **DRY Principle**
   - Avoid duplicate code.
   - Refactor or extract repeated code into reusable parts.

5. **Follow Next.js Rules**
   - Adhere to Next.js best practices, folder structure, routing, server/client components, etc.
   - Optimize Next.js features as per official docs.

6. **Layout File Editing**
   - Check the `layout` file for new pages.
   - Do not edit `layout.tsx` unless absolutely necessary and always confirm with the user.
   - Warn if layout changes may affect other pages.
   - Put client-side logic in descendant components, not in layout.
   - Keep layout files as server components.

7. **Default to Dark Theme**
   - Use dark theme as the default for all components/features.
   - Enable dark mode in UI kits and ensure all visuals fit dark mode.

8. **Design Innovation**
   - Suggest creative UI/UX ideas, animations, and effects that match branding.
   - Consider accessibility and performance.

9. **Consistency**
   - Follow project naming, folder structure, and code style.
   - Export new components for use in related features.

10. **Brief Documentation**
    - Add short code comments where needed, especially in complex parts.

11. **Testing**
    - Add tests/unit tests as per project standards when possible.

## Example
For an "add product" feature in e-commerce:
- Include a product form, validation (using existing form library), API connection (using existing data fetching), feedback/error handling
- Connect components to main/product list
- Follow Next.js structure and conventions
- No layout changes unless required
- All displays use dark mode
- UI shows innovation, engaging interactions/animations
- **Always reuse project components/utilities and apply DRY**

---

**Note:**  
Ask the user if there are special requirements for stack, structure, Next.js rules, or theme preferences.