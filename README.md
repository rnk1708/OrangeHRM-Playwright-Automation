\# OrangeHRM Playwright Automation Framework



A UI test automation project built with \*\*Playwright, JavaScript, and the Page Object Model (POM)\*\* to validate key workflows in the OrangeHRM web application.



\## Project Overview



This project automates functional, regression, smoke, negative-validation, and security-related UI scenarios against the OrangeHRM open-source demo application.



\*\*Application under test:\*\* \[OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login)



\## Technology Stack



\- \*\*Language:\*\* JavaScript

\- \*\*Automation:\*\* Playwright Test

\- \*\*Design pattern:\*\* Page Object Model (POM)

\- \*\*Test data:\*\* Excel workbooks and JSON files

\- \*\*Reporting:\*\* Playwright HTML Reporter and Allure Playwright Reporter

\- \*\*Version control:\*\* Git and GitHub



\## Framework Architecture



The framework separates test scenarios, page interactions, reusable utilities, test data, and configuration to improve maintainability and reusability.



```text

OrangeHRMS/

├── constants/       # Application URLs and constants

├── fixtures/        # Custom Playwright fixtures and login workflow

├── hooks/           # Shared test setup and teardown

├── pages/           # Page Object Model classes

├── tests/           # Automated test specifications

├── testdata/        # Excel, JSON, and resume test data

├── utils/           # Reusable methods, readers, and helpers

├── Suite-Documents/ # Test design and framework documentation

├── playwright.config.js

├── package.json

├── package-lock.json

└── .gitignore

```



\## Modules and Test Coverage



The project contains \*\*33 test cases across four modules\*\*.



| Module | Test Cases | Coverage |

|---|---:|---|

| Login | 10 | Login UI, authentication, validation, navigation, and security-related checks |

| Admin | 7 | User management, search, creation, validation, editing, and deletion |

| Recruitment | 6 | Candidate search, form validation, input controls, resume upload, and candidate creation |

| My Info | 10 | Personal details, validation, contact details, section navigation, and related forms |

| \*\*Total\*\* | \*\*33\*\* | |



Four Admin cases currently use Playwright's `test.fixme` marker and are skipped intentionally.



\## Prerequisites



\- Node.js and npm

\- Git

\- A supported browser installed by Playwright

\- Internet access to reach the OrangeHRM demo application



\## Installation



Clone the repository and navigate into the project directory:



```bash

git clone https://github.com/rnk1708/OrangeHRM-Playwright-Automation.git

cd OrangeHRM-Playwright-Automation

```



Install the project dependencies:



```bash

npm ci

```



Install the Playwright browsers if they are not already installed:



```bash

npx playwright install

```



\## Running the Tests



Run the entire suite in Chromium with a single worker:



```bash

npx playwright test --project=chromium --workers=1

```



Run an individual module:



```bash

npx playwright test tests/login.spec.js --project=chromium --workers=1

npx playwright test tests/admin.spec.js --project=chromium --workers=1

npx playwright test tests/recruitment.spec.js --project=chromium --workers=1

npx playwright test tests/myInfo.spec.js --project=chromium --workers=1

```



Run tests by title or tag:



```bash

npx playwright test --project=chromium --workers=1 --grep MI01

npx playwright test --project=chromium --workers=1 --grep "@Recruitment"

```



Run all configured browser projects:



```bash

npx playwright test

```



\## Reports



The Playwright configuration includes:



\- List reporter for execution output in the terminal

\- HTML reporter for a detailed browser test report

\- Allure Playwright reporter for Allure result files

\- Screenshots, traces, and videos for failed tests, according to the configured retention settings



Open the Playwright HTML report after execution:



```bash

npx playwright show-report

```



Allure results are written to `allure-results`. Generating and opening an Allure HTML report requires the Allure command-line tool to be available.



\## Current Test Status



The tests have passed in individual module runs, but the full suite has shown intermittent failures during combined execution.



A recent full Chromium run reported:



\- 25 passed

\- 4 failed

\- 4 skipped



Subsequent focused repeat runs of MI01 and R03 passed all three repetitions individually. The root causes of the intermittent full-suite failures remain under investigation.



The four Admin `test.fixme` cases remain skipped. Results may also vary because the project uses a public demo application that is outside the project's control.



\## Project Scope and Limitations



This is a learning and portfolio project intended to demonstrate automation framework design, reusable page objects, data-driven testing, test reporting, and version control.



The public demo application's availability, performance, and data can change. The tests should therefore be evaluated against their execution results rather than assumed to pass consistently in every environment.



\## Future Improvements



\- Investigate intermittent failures in full-suite execution

\- Improve test-data isolation and cleanup for scenarios that create records

\- Integrate automated execution with Jenkins

\- Review and refine reporting and continuous integration practices



\## Author



\*\*Ronak Maheria\*\*



GitHub: \[@rnk1708](https://github.com/rnk1708)



