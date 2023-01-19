# Carnegie Hall Music Timeline

Frontend of the music timeline for Carngie Hall's history of African American music, available at [timeline.carnegiehall.org](https://timeline.carnegiehall.org).

## Local development

- Clone this repository
- Install dependencies with `pnpm`
- Run `pnpm dev` to start up local development server on `localhost:3000`
- Work on the design system with `pnpm run storybook`, on `localhost:3002`
- Build locally with `pnpm turbo build`

## Built with

- NextJS 13 / React 18
- Typescript
- Tailwind CSS
- [Storybook](https://storybook.js.org/) for design system documentation
- [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for tests
- [Hygen](https://www.hygen.io/) for code scaffolding
- [Prettier](https://prettier.io/) for consistent code formatting

## Technical Notes

- Aliases for `src/..` `@types/..` and `.storybook/..` have been added as `$src`, `$types`, and `$storybook` to avoid requiring `../../../` style fragile import statements on nested components/pages/etc.
- Every component should have associated stories in a `[component].stories.ts` file to document its usage and create a sandbox in Storybook
- Given time constraints we're not doing much unit or integration testing, but where possible provide tests for crucial pieces of infrastructure so broken builds can't be promoted to production
- Ensure [Prettier](https://prettier.io/) is set up in your IDE to maintain a consistent code style throughout the project

## License

MIT
