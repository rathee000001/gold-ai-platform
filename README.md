# Gold.AI Forecasting Platform: Regression Intelligence System

The Gold.AI Regression Intelligence System turns a gold-price model into an inspectable analytical application. Inputs, training windows, coefficients, residuals, factor contributions and scenarios are available as parts of one story.

**[Open the live project](https://gold-ai-platform.vercel.app/)** · [Portfolio project story](https://ai-portfolio-kohl-beta.vercel.app/projects/gold-regression)

## What this project does

### Align the monthly inputs.

Public-data adapters feed month-end windows with explicit missing-data handling. A 19-factor interpretation registry records definitions and context, while the typed regression matrix identifies the inputs used for a particular analysis.

The registry is an interpretation layer, not an automatic claim that every model has nineteen independently meaningful coefficients. Proxy definitions, coverage and alignment affect what the resulting regression can reasonably explain.

### Fit a transparent Ridge model.

The application implements Ridge regression and exposes coefficient and statistical outputs. The 2006–2020 training period is kept distinct from the later evaluation period, and the model's inputs and window can be inspected.

The design favors visible computation over an opaque prediction badge. Coefficients describe this fitted model under its inputs and assumptions; they are not proof of economic causation or future trading usefulness.

### Carry fixed coefficients into a later period.

The 2021–2025 later-period evaluation applies frozen coefficients instead of refitting the past to make the later result look better. Residual and error views provide a separate way to inspect where the model fails.

The distinction between training fit and later-period behavior is central to the project. A visually persuasive chart is not enough: the evaluation window, coefficient treatment and proxy assumptions need to remain understandable.

### Explore contributions, regimes and scenarios.

Factor-contribution views decompose the modeled result, while regime exploration and proxy scenarios expose conditional changes. Interactive charts and downloadable outputs let the analysis move beyond one static screen.

Scenario results depend on the supplied assumptions. Historical-context lookup in this generation is deterministic context support, not a live generative AI system. The page keeps that boundary explicit.

## Scope and limitations

19 factors. Training 2006–2020; later-period validation 2021–2025. Proxy and scenario assumptions. No investment recommendation.

The supported outcome is a working project-based analytical system. It is not investment advice, proof of forecasting superiority, real-time automated trading or a causal explanation of the gold market.

## Project links

- [Live project](https://gold-ai-platform.vercel.app/)

## Author and project context

Created by [Praveen Rathee](https://github.com/rathee000001). The [portfolio story](https://ai-portfolio-kohl-beta.vercel.app/projects/gold-regression) explains the project’s purpose, workflow, available artifacts and evidence limits. This overview is based on that project record.
