
# Copilot Instructions (General Version)

## Purpose
Copilot must always generate complete, ready-to-use feature code using the project's existing stack, libraries, and conventions.

## Next.js Requirement for New UI
All new UI implementations must always use Next.js as the framework, following its best practices and conventions.

## Additional Rule: Honest and Objective Answers
Always answer all user questions and requests honestly and objectively, without the need to justify or agree with the user's opinions or answers. Responses should be direct, factual, and unbiased.

## Additional Rule: English-Only UI
All UI elements (text, labels, buttons, messages, etc.) must be written in English.

## Universal Project Vision & Requirements

### Vision & Purpose
- Build a flexible, modern web application that can be adapted for any brand, company, or use case.
- Focus on clean, elegant, and modern design with a customizable theme (dark mode, light mode, or others as needed).
- Homepage and main sections should highlight the unique story, vision, and information relevant to the brand or project.
- Provide dedicated pages for company/brand information, team, history, and achievements if relevant.
- Product or content pages should show detailed information, curated reviews, media presentations, and comparison features if applicable.
- Core features: shopping cart, checkout, wishlist, order history, reviews, testimonials, or other features as required by the project.
- Smooth transition/interaction animations, innovative UX, and intuitive navigation.
- Platform must be flexible and easily customizable for any brand, product, or content type.
- Avoid crowded/generic appearance, prioritize storytelling and clarity.
- Use the stack, components, and structure already present in the project.
- Follow Next.js (or project framework) best practices and ensure all features are ready to use immediately.

### Implementation Principles
- All features must be immediately usable and connected to existing components.
- Do not add new libraries without permission.
- Default to a clean, minimalist design. Theme (dark/light/custom) should be flexible and follow user or project requirements.
- Animations and UX innovation on main sections (story, product/content, testimonial, etc.).
- Brief testing and documentation for complex logic.

---

## Project Feature Guidelines

**Purpose:**  
Build a universal, brand-adaptable web application that empowers any company or project to present their story, products, or content, while focusing on information clarity and storytelling. The site should avoid a cluttered look and instead offer a clean, elegant, and modern experience.

### Key Principles

1. **Brand/Project-Centric Design**
   - Homepage highlights the story, vision, and unique selling points.
   - Provide dedicated sections for company/brand information, team, history, and achievements if needed.
   - Product/content pages offer detailed information, including specifications, story, and curated reviews.

2. **Minimalist & Modern UI**
   - Theme (dark, light, or custom) should be flexible and follow project/user requirements.
   - Use a clean, spacious layout with clear typography.
   - Avoid excessive listings, ads, or categories.
   - Prioritize visual storytelling with high-quality images and videos.

3. **Universal & Flexible**
   - The platform should be usable by any brand or project, regardless of type.
   - All features must be generic and easily customizable.

4. **Complete Features**
   - Shopping cart, checkout, wishlist, order history, reviews, testimonials, or other features as required.
   - Simple, intuitive navigation.

5. **Innovative UX**
   - Smooth animations for transitions and interactions.
   - Story section with animated reveals.
   - Comparison features if relevant.
   - Video/media presentations for brands/products/content.
   - Curated testimonials and reviews.

6. **Framework Best Practices**
   - Follow project conventions for routing, server/client components, and folder structure.
   - Reuse existing components and utilities.
   - Do not add new libraries without permission.

7. **Documentation & Testing**
   - Add brief code comments for complex logic.
   - Include unit tests as per project standards.

---

**Note:**  
Always prioritize information clarity and storytelling, not just listings. The site should feel exclusive, informative, and visually engaging—never crowded or generic.

## Main Rules

1. **Complete Features**
   - Implement every required part: UI, logic, API, validation, routing, etc.
   - Update all relevant files so the feature works immediately.

2. **Honest and Objective Answers**
   - Copilot must always provide honest and objective answers, without the need to justify or agree with the user's opinions or answers.

3. **Use Existing Stack/Libraries**
   - Always use the frameworks, UI kits, state management, etc. already in the project.
   - Do not add new libraries without permission.
   - Follow project structure and conventions.

4. **Reuse Existing Components/Functions**
   - Always use available components/functions.
   - Check shared component collections, helpers, and utilities before creating new ones.

5. **DRY Principle**
   - Avoid duplicate code.
   - Refactor or extract repeated code into reusable parts.

6. **Follow Framework Rules**
   - Adhere to framework best practices, folder structure, routing, server/client components, etc.
   - Optimize features as per official docs.

7. **Layout File Editing**
   - Check the `layout` file for new pages.
   - Do not edit `layout.tsx` unless absolutely necessary and always confirm with the user.
   - Warn if layout changes may affect other pages.
   - Put client-side logic in descendant components, not in layout.
   - Keep layout files as server components if using Next.js.

8. **Theme Flexibility**
   - Theme (dark, light, or custom) should be flexible and follow user or project requirements.
   - Ensure all visuals fit the selected theme.

9. **Design Innovation**
   - Suggest creative UI/UX ideas, animations, and effects that match branding or project goals.
   - Consider accessibility and performance.

10. **Consistency**
   - Follow project naming, folder structure, and code style.
   - Export new components for use in related features.

11. **Brief Documentation**
    - Add short code comments where needed, especially in complex parts.

12. **Testing**
    - Add tests/unit tests as per project standards when possible.

## Example
For an "add feature" request:
- Include all UI, validation (using existing form library), API connection (using existing data fetching), feedback/error handling
- Connect components to main/content list
- Follow project structure and conventions
- No layout changes unless required
- Theme should be flexible (not always dark mode)
- UI shows innovation, engaging interactions/animations
- **Always reuse project components/utilities and apply DRY**

---

**Note:**  
Ask the user if there are special requirements for stack, structure, framework rules, or theme preferences.