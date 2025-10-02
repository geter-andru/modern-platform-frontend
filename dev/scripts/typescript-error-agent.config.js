/**
 * TypeScript Error Agent Configuration
 */
 * Configuration file for the TypeScript Error Agent System
 * Defines rules, patterns, and behaviors for error detection and resolution
 */

module.exports = {
  // Project settings
  project: {
    root: process.cwd(),
    tsconfigPath: './tsconfig.json',
    excludePatterns: [
      'node_modules/**',
      'mcp-servers/**',
      '**/*.d.ts',
      '**/archive/**',
      '**/*.archive.*'
    ]
  },

  // Error detection settings
  detection: {
    // TypeScript compiler options
    compilerOptions: {
      strict: true,
      noEmit: true,
      skipLibCheck: true
    },
    
    // Error severity levels
    severityLevels: {
      error: 'error',
      warning: 'warning',
      info: 'info'
    },
    
    // Maximum errors to process in one run
    maxErrors: 1000
  },

  // Error categorization rules
  categorization: {
    jsdoc: {
      patterns: [
        'TS1109', // Expression expected
        'TS1005', // ';' expected
        'TS1434', // Unexpected keyword or identifier
        'TS1161', // Unterminated regular expression literal
        'TS1003', // Identifier expected
        'TS1128', // Declaration or statement expected
        'TS1131'  // Property or signature expected
      ],
      keywords: [
        'Expression expected',
        'Unterminated regular expression',
        'Unexpected keyword',
        'Identifier expected'
      ]
    },
    
    import: {
      patterns: [
        'TS2307', // Cannot find module
        'TS2306', // File not found
        'TS2304', // Cannot find name
        'TS2305'  // Module has no exported member
      ],
      keywords: [
        'Cannot find module',
        'Module not found',
        'Cannot find name',
        'has no exported member'
      ]
    },
    
    type: {
      patterns: [
        'TS2322', // Type is not assignable
        'TS2345', // Argument of type is not assignable
        'TS2339', // Property does not exist
        'TS2346', // Supplied parameters do not match
        'TS2352', // Conversion of type may be a mistake
        'TS2353', // Object literal may only specify known properties
        'TS2354', // This syntax requires an imported helper
        'TS2355', // A function whose declared type is neither 'void' nor 'any' must return a value
        'TS2356', // An arithmetic operand must be of type 'any', 'number', 'bigint' or an enum type
        'TS2357', // The operand of a delete operator must be optional
        'TS2358', // The left-hand side of an assignment expression must be a variable or a property access
        'TS2359', // The operand of an increment or decrement operator must be a variable or a property access
        'TS2360', // The left-hand side of an assignment expression must be a variable or a property access
        'TS2361', // The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type
        'TS2362', // The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type
        'TS2363', // The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type
        'TS2364', // The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type
        'TS2365', // Operator '+' cannot be applied to types
        'TS2366', // Function lacks ending return statement and return type does not include 'undefined'
        'TS2367', // This condition will always return 'true' since the types have no overlap
        'TS2368', // The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type
        'TS2369', // A parameter property is only allowed in a constructor implementation
        'TS2370', // A rest parameter must be of an array type
        'TS2371', // A parameter cannot have question mark and initializer
        'TS2372', // Parameter cannot have question mark and initializer
        'TS2373', // Parameter cannot have question mark and initializer
        'TS2374', // Parameter cannot have question mark and initializer
        'TS2375', // Parameter cannot have question mark and initializer
        'TS2376', // Parameter cannot have question mark and initializer
        'TS2377', // Parameter cannot have question mark and initializer
        'TS2378', // Parameter cannot have question mark and initializer
        'TS2379', // Parameter cannot have question mark and initializer
        'TS2380', // Parameter cannot have question mark and initializer
        'TS2381', // Parameter cannot have question mark and initializer
        'TS2382', // Parameter cannot have question mark and initializer
        'TS2383', // Parameter cannot have question mark and initializer
        'TS2384', // Parameter cannot have question mark and initializer
        'TS2385', // Parameter cannot have question mark and initializer
        'TS2386', // Parameter cannot have question mark and initializer
        'TS2387', // Parameter cannot have question mark and initializer
        'TS2388', // Parameter cannot have question mark and initializer
        'TS2389', // Parameter cannot have question mark and initializer
        'TS2390', // Parameter cannot have question mark and initializer
        'TS2391', // Parameter cannot have question mark and initializer
        'TS2392', // Parameter cannot have question mark and initializer
        'TS2393', // Parameter cannot have question mark and initializer
        'TS2394', // Parameter cannot have question mark and initializer
        'TS2395', // Parameter cannot have question mark and initializer
        'TS2396', // Parameter cannot have question mark and initializer
        'TS2397', // Parameter cannot have question mark and initializer
        'TS2398', // Parameter cannot have question mark and initializer
        'TS2399', // Parameter cannot have question mark and initializer
        'TS2400', // Parameter cannot have question mark and initializer
        'TS2401', // Parameter cannot have question mark and initializer
        'TS2402', // Parameter cannot have question mark and initializer
        'TS2403', // Parameter cannot have question mark and initializer
        'TS2404', // Parameter cannot have question mark and initializer
        'TS2405', // Parameter cannot have question mark and initializer
        'TS2406', // Parameter cannot have question mark and initializer
        'TS2407', // Parameter cannot have question mark and initializer
        'TS2408', // Parameter cannot have question mark and initializer
        'TS2409', // Parameter cannot have question mark and initializer
        'TS2410', // Parameter cannot have question mark and initializer
        'TS2411', // Parameter cannot have question mark and initializer
        'TS2412', // Parameter cannot have question mark and initializer
        'TS2413', // Parameter cannot have question mark and initializer
        'TS2414', // Parameter cannot have question mark and initializer
        'TS2415', // Parameter cannot have question mark and initializer
        'TS2416', // Parameter cannot have question mark and initializer
        'TS2417', // Parameter cannot have question mark and initializer
        'TS2418', // Parameter cannot have question mark and initializer
        'TS2419', // Parameter cannot have question mark and initializer
        'TS2420', // Parameter cannot have question mark and initializer
        'TS2421', // Parameter cannot have question mark and initializer
        'TS2422', // Parameter cannot have question mark and initializer
        'TS2423', // Parameter cannot have question mark and initializer
        'TS2424', // Parameter cannot have question mark and initializer
        'TS2425', // Parameter cannot have question mark and initializer
        'TS2426', // Parameter cannot have question mark and initializer
        'TS2427', // Parameter cannot have question mark and initializer
        'TS2428', // Parameter cannot have question mark and initializer
        'TS2429', // Parameter cannot have question mark and initializer
        'TS2430'  // Parameter cannot have question mark and initializer
      ],
      keywords: [
        'Type',
        'Property',
        'not assignable',
        'does not exist',
        'Cannot find name'
      ]
    },
    
    syntax: {
      patterns: [
        'TS1003', // Identifier expected
        'TS1128', // Declaration or statement expected
        'TS1131', // Property or signature expected
        'TS1136', // Property expected
        'TS1138', // Parameter declaration expected
        'TS1139', // Type expected
        'TS1140', // Type expected
        'TS1141', // String literal expected
        'TS1142', // ';' expected
        'TS1143', // ';' expected
        'TS1144', // ';' expected
        'TS1145', // ';' expected
        'TS1146', // ';' expected
        'TS1147', // ';' expected
        'TS1148', // ';' expected
        'TS1149', // ';' expected
        'TS1150', // ';' expected
        'TS1151', // ';' expected
        'TS1152', // ';' expected
        'TS1153', // ';' expected
        'TS1154', // ';' expected
        'TS1155', // ';' expected
        'TS1156', // ';' expected
        'TS1157', // ';' expected
        'TS1158', // ';' expected
        'TS1159', // ';' expected
        'TS1160', // ';' expected
        'TS1161', // Unterminated regular expression literal
        'TS1162', // An object literal cannot have multiple properties with the same name
        'TS1163', // A computed property name must be of type 'string', 'number', 'symbol', or 'any'
        'TS1164', // Computed property names are not allowed in enums
        'TS1165', // A computed property name in a type literal must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1166', // A computed property name in a class field declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1167', // A computed property name in a method declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1168', // A computed property name in a get accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1169', // A computed property name in a set accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1170', // A computed property name in a class field declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1171', // A computed property name in a method declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1172', // A computed property name in a get accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1173', // A computed property name in a set accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1174', // A computed property name in a class field declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1175', // A computed property name in a method declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1176', // A computed property name in a get accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1177', // A computed property name in a set accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1178', // A computed property name in a class field declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1179', // A computed property name in a method declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1180', // A computed property name in a get accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1181', // A computed property name in a set accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1182', // A computed property name in a class field declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1183', // A computed property name in a method declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1184', // A computed property name in a get accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1185', // A computed property name in a set accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1186', // A computed property name in a class field declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1187', // A computed property name in a method declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1188', // A computed property name in a get accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1189', // A computed property name in a set accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1190', // A computed property name in a class field declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1191', // A computed property name in a method declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1192', // A computed property name in a get accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1193', // A computed property name in a set accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1194', // A computed property name in a class field declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1195', // A computed property name in a method declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1196', // A computed property name in a get accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1197', // A computed property name in a set accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1198', // A computed property name in a class field declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1199', // A computed property name in a method declaration must refer to an expression whose type is a literal type or a 'unique symbol' type
        'TS1200'  // A computed property name in a get accessor must refer to an expression whose type is a literal type or a 'unique symbol' type
      ],
      keywords: [
        'syntax',
        'expected',
        'Identifier expected',
        'Declaration or statement expected'
      ]
    },
    
    configuration: {
      patterns: [
        'TS18026', // '#!/usr/bin/env node' can only be used at the start of a file
        'TS18027', // '#!/usr/bin/env node' can only be used at the start of a file
        'TS18028', // '#!/usr/bin/env node' can only be used at the start of a file
        'TS18029', // '#!/usr/bin/env node' can only be used at the start of a file
        'TS18030'  // '#!/usr/bin/env node' can only be used at the start of a file
      ],
      keywords: [
        'tsconfig',
        'configuration',
        '#!/usr/bin/env node'
      ]
    }
  },

  // Auto-fix settings
  autoFix: {
    enabled: true,
    backup: true,
    dryRun: false,
    maxFiles: 100,
    maxErrorsPerFile: 50
  },

  // Resolution strategies
  resolution: {
    jsdoc: {
      enabled: true,
      patterns: [
        { from: /\*\*\s*\n\s*\*\*\s*\n/g, to: ' *\n' },
        { from: /^\s*\*\s*$/gm, to: ' *' },
        { from: /\*\*\s*\n\s*\*\*\s*\n\s*\*/g, to: ' */' },
        { from: /\*\*\s*\n\s*\*\*\s*\n\s*\*\s*\n/g, to: ' *\n' }
      ]
    },
    
    import: {
      enabled: false, // Requires more complex logic
      autoImport: false,
      removeUnused: false
    },
    
    type: {
      enabled: false, // Requires more complex logic
      strictMode: false,
      anyFallback: false
    },
    
    syntax: {
      enabled: false, // Requires more complex logic
      autoFormat: false,
      fixIndentation: false
    }
  },

  // Reporting settings
  reporting: {
    format: 'console', // 'console', 'json', 'html'
    includeStats: true,
    includeSuggestions: true,
    includeTiming: true,
    outputFile: null
  },

  // CI/CD settings
  ci: {
    failOnError: true,
    failOnWarning: false,
    maxErrors: 0,
    maxWarnings: 10
  },

  // Performance settings
  performance: {
    maxConcurrentFiles: 10,
    timeout: 30000, // 30 seconds
    memoryLimit: '512MB'
  }
};
