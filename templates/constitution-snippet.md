# LiveDoc + SpecKit Constitution Snippet

Add this to your `.specify/constitution.md` to integrate LiveDoc with your SpecKit workflow.

---

## Diagram Guidelines

### When to Create Diagrams

- **Architecture decisions**: Create architecture diagrams for significant system design
- **Complex flows**: Create sequence diagrams for multi-step processes
- **Data models**: Create ERD diagrams for database schemas
- **API contracts**: Create diagrams showing API interactions

### Diagram Location

All diagrams for a feature should be placed in:
```
specs/{feature-id}/diagrams/
```

Example:
```
specs/001-auth/diagrams/
├── architecture.puml    # System architecture
├── flow.mmd            # User flow
└── data-model.erd      # Database schema
```

### Diagram References in Markdown

Use LiveDoc URLs in your Markdown files:
```markdown
![Architecture](http://localhost:3000/specs/001-auth/diagrams/architecture.puml)
```

### Supported Formats

- `.puml` - PlantUML (UML, C4, sequence diagrams)
- `.mmd` - Mermaid (flowcharts, sequence, gantt)
- `.d2` - D2 (modern diagram language)
- `.erd` - Entity Relationship diagrams
- `.nomnoml` - Class diagrams
- And 20+ more formats via Kroki

### Best Practices

1. **One diagram per concept**: Don't overload diagrams with too much information
2. **Use descriptive filenames**: `user-registration-flow.mmd` not `flow1.mmd`
3. **Keep diagrams updated**: Update diagrams when the design changes
4. **Add diagram references**: Include diagram links in spec.md and plan.md
