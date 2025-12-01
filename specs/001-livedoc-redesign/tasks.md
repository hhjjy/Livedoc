# Tasks: LiveDoc v2 Redesign

**Input**: Design documents from `/specs/001-livedoc-redesign/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested - implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US7)
- Include exact file paths in descriptions

## Path Conventions

- **Project Type**: Single CLI application
- **Source**: `src/` at repository root
- **Tests**: `tests/` at repository root
- **CLI Entry**: `bin/livedoc.js`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency setup

- [x] T001 Update package.json with new dependencies (detect-port) and npm scripts in `package.json`
- [x] T002 [P] Create new directory structure: `src/cli/commands/`, `src/config/`, `src/templates/`
- [x] T003 [P] Remove deprecated files: `src/cli/init.js`, `src/cli/list.js` (v0.1 project registration)
- [x] T004 [P] Create .gitignore entries for local config files (.livedocrc, *.local.json)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create default configuration values in `src/config/defaults.js`
- [x] T006 [P] Create format mapping (25+ types) in `src/config/formats.js`
- [x] T007 Implement configuration loader (env > file > default) in `src/config/loader.js`
- [x] T008 [P] Implement path security validator in `src/utils/security.js`
- [x] T009 [P] Create error image SVG generator in `src/utils/error-image.js`
- [x] T010 Refactor Kroki client for new API pattern in `src/utils/kroki.js`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Single Command Installation (Priority: P1) MVP

**Goal**: Users can install LiveDoc with `npm install -g` and run basic commands

**Independent Test**: Run `npm install -g .` locally, then `livedoc --version` and `livedoc --help`

### Implementation for User Story 1

- [x] T011 [US1] Update CLI entry point with Commander setup in `bin/livedoc.js`
- [x] T012 [P] [US1] Create version command in `src/cli/commands/version.js`
- [x] T013 [P] [US1] Create help command in `src/cli/commands/help.js` (built into Commander)
- [x] T014 [US1] Create CLI index with command registration in `src/cli/index.js`
- [x] T015 [US1] Update package.json bin entry and version to 2.0.0 in `package.json`

**Checkpoint**: `livedoc --version` and `livedoc --help` work after local npm install

---

## Phase 4: User Story 2 - Zero-Config Server Start (Priority: P1)

**Goal**: Users can run `livedoc start` in any directory to start the diagram server

**Independent Test**: Run `livedoc start` in a directory with a .puml file, access via browser

### Implementation for User Story 2

- [x] T016 [US2] Refactor Express app factory for zero-init in `src/server/app.js`
- [x] T017 [P] [US2] Implement port finder utility in `src/utils/port-finder.js`
- [x] T018 [US2] Create start command with zero-config in `src/cli/commands/start.js`
- [x] T019 [US2] Update router for simplified URL pattern (/{path}) in `src/server/router.js`
- [x] T020 [US2] Implement static file handler in `src/server/handlers/static.js`
- [x] T021 [US2] Implement dynamic diagram handler (Kroki proxy) in `src/server/handlers/diagram.js`
- [x] T022 [US2] Implement error handler (returns error images) in `src/server/handlers/error.js`
- [x] T023 [US2] Add startup message with base URL display in `src/server/app.js`

**Checkpoint**: `livedoc start` launches server, can access diagrams via `http://localhost:3000/{path}`

---

## Phase 5: User Story 3 - SpecKit Integration (Priority: P1)

**Goal**: Diagrams in `specs/{feature}/diagrams/` are accessible via LiveDoc URLs

**Independent Test**: Create `specs/001-test/diagrams/flow.puml`, access via LiveDoc URL in Markdown preview

### Implementation for User Story 3

- [x] T024 [US3] Verify router handles nested paths like `/specs/001-auth/diagrams/flow.puml`
- [x] T025 [US3] Update quickstart.md with SpecKit integration examples in `specs/001-livedoc-redesign/quickstart.md`
- [x] T026 [US3] Create sample diagram in `demo/specs/001-example/diagrams/architecture.puml`

**Checkpoint**: SpecKit directory structure works with LiveDoc URLs in Markdown preview

---

## Phase 6: User Story 4 - Custom Kroki Endpoint (Priority: P2)

**Goal**: Users can configure custom Kroki service via env var or config file

**Independent Test**: Set `LIVEDOC_KROKI_URL=https://kroki.chuntech.org`, verify diagrams render

### Implementation for User Story 4

- [x] T027 [US4] Add environment variable loading for LIVEDOC_* in `src/config/loader.js`
- [x] T028 [P] [US4] Add .livedocrc file loading support in `src/config/loader.js`
- [x] T029 [P] [US4] Add livedoc.config.json file loading support in `src/config/loader.js`
- [x] T030 [US4] Update Kroki client to use configured endpoint in `src/utils/kroki.js`
- [x] T031 [US4] Display configured Kroki URL in startup message in `src/server/app.js`

**Checkpoint**: Custom Kroki endpoint works via both env var and config file

---

## Phase 7: User Story 5 - Multiple Diagram Formats (Priority: P2)

**Goal**: Support 25+ diagram formats (all Kroki-supported types)

**Independent Test**: Create .nomnoml, .d2, .mmd files and verify all render correctly

### Implementation for User Story 5

- [x] T032 [US5] Verify format mapping covers all 25+ types in `src/config/formats.js`
- [x] T033 [US5] Update diagram handler to use format mapping in `src/server/handlers/diagram.js`
- [x] T034 [P] [US5] Create demo files for various formats in `demo/livedoc/diagrams/`
- [ ] T035 [US5] Update README with supported formats list in `README.md`

**Checkpoint**: All 25+ diagram formats render correctly via LiveDoc

---

## Phase 8: User Story 6 - Error Visualization (Priority: P2)

**Goal**: All errors return readable error images instead of broken image icons

**Independent Test**: Request non-existent file, syntax-error file, verify error images display

### Implementation for User Story 6

- [x] T036 [US6] Implement file-not-found error image in `src/server/handlers/error.js`
- [x] T037 [P] [US6] Implement unsupported-format error image in `src/server/handlers/error.js`
- [x] T038 [P] [US6] Implement kroki-error image (connection/timeout) in `src/server/handlers/error.js`
- [x] T039 [P] [US6] Implement syntax-error image (parse Kroki error response) in `src/server/handlers/error.js`
- [x] T040 [P] [US6] Implement file-too-large error image in `src/server/handlers/error.js`
- [x] T041 [P] [US6] Implement path-traversal error image in `src/server/handlers/error.js`
- [x] T042 [US6] Ensure all error responses return HTTP 200 + Content-Type image/svg+xml (SVG, not PNG)

**Checkpoint**: All error scenarios return readable PNG images with error messages

---

## Phase 9: User Story 7 - SpecKit + Claude Code Integration (Priority: P1)

**Goal**: Provide Constitution snippet and Claude Code Hook for diagram workflow automation

**Independent Test**: Copy Constitution snippet, run `/speckit.plan`, verify diagram planning is included

### Implementation for User Story 7

- [x] T043 [US7] Create Constitution snippet template in `src/templates/constitution-snippet.md`
- [x] T044 [P] [US7] Create Claude Code Hook template in `src/templates/claude-hook.md`
- [x] T045 [US7] Copy templates to user-facing location in `templates/`
- [x] T046 [US7] Add `livedoc templates` command to show template locations in `src/cli/commands/templates.js`
- [ ] T047 [US7] Document SpecKit integration in README in `README.md`

**Checkpoint**: Users can copy templates to enable Claude Code diagram automation

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and documentation

- [x] T048 [P] Update README.md with v2 documentation in `README.md`
- [x] T049 [P] Update CLAUDE.md with v2 usage patterns in `CLAUDE.md`
- [x] T050 Remove deprecated v0.1 code and comments
- [x] T051 [P] Create architecture diagram for LiveDoc itself in `specs/001-livedoc-redesign/diagrams/architecture.puml`
- [ ] T052 Run quickstart.md validation (manual walkthrough)
- [ ] T053 Final npm publish preparation (version bump, changelog)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - US1, US2 are core prerequisites for other stories
  - US3-US7 can proceed in parallel after US2 complete
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US1 (Installation) | Phase 2 | None - first story |
| US2 (Zero-Config) | US1 | None - core functionality |
| US3 (SpecKit) | US2 | US4, US5, US6, US7 |
| US4 (Kroki Config) | US2 | US3, US5, US6, US7 |
| US5 (Formats) | US2 | US3, US4, US6, US7 |
| US6 (Errors) | US2 | US3, US4, US5, US7 |
| US7 (Claude Code) | US2 | US3, US4, US5, US6 |

### Within Each User Story

- Config/Utils before Server components
- Server handlers before CLI commands
- Core implementation before integration
- Story complete before marking checkpoint

### Parallel Opportunities

**Phase 2 (Foundational)**:
```
Parallel Group A: T005, T006 (config files)
Parallel Group B: T008, T009 (utils)
Then: T007, T010 (depend on config)
```

**After Phase 4 (US2)**:
```
US3, US4, US5, US6, US7 can all start in parallel
```

---

## Implementation Strategy

### MVP First (User Stories 1-2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 - Installation
4. Complete Phase 4: US2 - Zero-Config Server
5. **STOP and VALIDATE**: Test `livedoc start` with real diagrams
6. This is a functional MVP that can be used immediately

### Incremental Delivery

| Release | User Stories | Value Delivered |
|---------|--------------|-----------------|
| v2.0.0-alpha | US1 + US2 | Basic diagram serving |
| v2.0.0-beta | + US3 + US4 | SpecKit integration + Custom Kroki |
| v2.0.0-rc | + US5 + US6 | Full format support + Error handling |
| v2.0.0 | + US7 + Polish | Claude Code automation |

### Single Developer Strategy

1. Complete Setup → Foundational → US1 → US2 (core path)
2. Add US6 (error handling improves all subsequent development)
3. Add US5 (format support)
4. Add US4 (Kroki configuration)
5. Add US3 (SpecKit integration)
6. Add US7 (Claude Code templates)
7. Polish phase

---

## Notes

- All [P] tasks in same phase can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story checkpoint validates independent functionality
- Existing v0.1 code in src/ will be refactored, not deleted entirely
- Focus on zero-init experience throughout implementation
