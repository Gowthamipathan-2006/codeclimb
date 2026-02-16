
import { getTopic, getDifficulty } from './curriculum';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface CodingChallenge {
  problem: string;
  input: string;
  output: string;
  example: string;
}

export interface LevelContent {
  title: string;
  topic: string;
  difficulty: string;
  theory: {
    content: string;
    syntax?: string;
    codeExample?: string;
  };
  quiz: QuizQuestion[];
  codingChallenge?: CodingChallenge;
}

// ────────────────────────────────────────────
// C LANGUAGE CONTENT
// ────────────────────────────────────────────
const cContent: { [level: number]: Omit<LevelContent, 'title' | 'topic' | 'difficulty'> } = {
  1: {
    theory: {
      content: 'C is a general-purpose programming language created by Dennis Ritchie at Bell Labs in 1972. It is one of the most widely used languages and has influenced many modern languages like C++, Java, and Python. C gives you direct control over hardware and memory, making it perfect for system programming.',
      syntax: `#include <stdio.h>\n\nint main() {\n    // your code here\n    return 0;\n}`,
      codeExample: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`
    },
    quiz: [
      { question: 'Who created the C programming language?', options: ['James Gosling', 'Dennis Ritchie', 'Bjarne Stroustrup', 'Guido van Rossum'], correctAnswer: 'Dennis Ritchie' },
      { question: 'What is the correct file extension for C source code?', options: ['.cpp', '.c', '.java', '.py'], correctAnswer: '.c' },
      { question: 'What does #include <stdio.h> do?', options: ['Includes standard input/output library', 'Includes math library', 'Creates a new file', 'Defines a variable'], correctAnswer: 'Includes standard input/output library' }
    ],
    codingChallenge: { problem: 'Write a C program that prints "Hello, CodeClimb!" to the console.', input: 'None', output: 'Hello, CodeClimb!', example: '#include <stdio.h>\nint main() {\n    printf("Hello, CodeClimb!");\n    return 0;\n}' }
  },
  2: {
    theory: {
      content: 'A C program has a specific structure: preprocessor directives (#include), the main function, and statements inside curly braces. Every C program must have a main() function — it is the entry point where execution begins. Statements end with semicolons.',
      syntax: `#include <header_file>\n\nreturn_type main() {\n    statement1;\n    statement2;\n    return 0;\n}`,
      codeExample: `#include <stdio.h>\n\nint main() {\n    printf("Line 1\\n");\n    printf("Line 2\\n");\n    return 0;  // 0 means success\n}`
    },
    quiz: [
      { question: 'What is the entry point of a C program?', options: ['start()', 'main()', 'begin()', 'init()'], correctAnswer: 'main()' },
      { question: 'What character ends most statements in C?', options: ['Colon :', 'Period .', 'Semicolon ;', 'Comma ,'], correctAnswer: 'Semicolon ;' },
      { question: 'What does return 0 mean in main()?', options: ['The program failed', 'The program ran successfully', 'The program should restart', 'Nothing'], correctAnswer: 'The program ran successfully' }
    ],
    codingChallenge: { problem: 'Write a C program that prints your name and age on separate lines.', input: 'None', output: 'John\n25', example: '#include <stdio.h>\nint main() {\n    printf("John\\n");\n    printf("25\\n");\n    return 0;\n}' }
  },
  3: {
    theory: {
      content: 'Variables are named storage locations in memory that hold data. In C, you must declare a variable before using it by specifying its data type and name. Variable names must start with a letter or underscore and cannot be C keywords.',
      syntax: `data_type variable_name;\ndata_type variable_name = value;`,
      codeExample: `#include <stdio.h>\n\nint main() {\n    int age = 25;\n    float height = 5.9;\n    char initial = 'J';\n    printf("Age: %d\\n", age);\n    printf("Height: %.1f\\n", height);\n    printf("Initial: %c\\n", initial);\n    return 0;\n}`
    },
    quiz: [
      { question: 'Which is a valid variable name in C?', options: ['2count', 'my-var', '_total', 'int'], correctAnswer: '_total' },
      { question: 'What happens if you use a variable without declaring it?', options: ['It works fine', 'Compilation error', 'Runtime warning', 'It defaults to 0'], correctAnswer: 'Compilation error' },
      { question: 'Which symbol is used for assignment in C?', options: ['==', '=', ':=', '=>'], correctAnswer: '=' }
    ],
    codingChallenge: { problem: 'Declare an integer variable called "score" with value 100 and print it.', input: 'None', output: '100', example: '#include <stdio.h>\nint main() {\n    int score = 100;\n    printf("%d", score);\n    return 0;\n}' }
  },
  4: {
    theory: {
      content: 'C has several basic data types: int (integers like 5, -3), float (decimal numbers like 3.14), double (more precise decimals), char (single characters like \'A\'). Each type uses a different amount of memory. int uses 4 bytes, char uses 1 byte, float uses 4 bytes, double uses 8 bytes.',
      syntax: `int    a;    // 4 bytes, whole numbers\nfloat  b;    // 4 bytes, decimal numbers\ndouble c;    // 8 bytes, precise decimals\nchar   d;    // 1 byte, single character`,
      codeExample: `#include <stdio.h>\n\nint main() {\n    int count = 10;\n    float price = 9.99;\n    double pi = 3.14159265358979;\n    char letter = 'Z';\n    \n    printf("Size of int: %lu bytes\\n", sizeof(int));\n    printf("Size of float: %lu bytes\\n", sizeof(float));\n    printf("Size of double: %lu bytes\\n", sizeof(double));\n    printf("Size of char: %lu bytes\\n", sizeof(char));\n    return 0;\n}`
    },
    quiz: [
      { question: 'Which data type is used to store a single character?', options: ['int', 'char', 'string', 'character'], correctAnswer: 'char' },
      { question: 'How many bytes does an int typically use?', options: ['1', '2', '4', '8'], correctAnswer: '4' },
      { question: 'Which type offers more precision: float or double?', options: ['float', 'double', 'They are the same', 'Neither'], correctAnswer: 'double' }
    ],
    codingChallenge: { problem: 'Create variables of each basic type (int, float, double, char) and print their sizes using sizeof().', input: 'None', output: 'int: 4\nfloat: 4\ndouble: 8\nchar: 1', example: '#include <stdio.h>\nint main() {\n    printf("int: %lu\\n", sizeof(int));\n    printf("float: %lu\\n", sizeof(float));\n    printf("double: %lu\\n", sizeof(double));\n    printf("char: %lu\\n", sizeof(char));\n    return 0;\n}' }
  },
  5: {
    theory: {
      content: 'Constants are values that cannot be changed once defined. In C, you can create constants using the const keyword or #define preprocessor directive. Literals are fixed values written directly in code like 42, 3.14, or \'A\'. Using constants makes code more readable and prevents accidental modifications.',
      syntax: `const data_type NAME = value;\n#define NAME value`,
      codeExample: `#include <stdio.h>\n#define PI 3.14159\n\nint main() {\n    const int MAX_SIZE = 100;\n    float radius = 5.0;\n    float area = PI * radius * radius;\n    \n    printf("Max size: %d\\n", MAX_SIZE);\n    printf("Area: %.2f\\n", area);\n    return 0;\n}`
    },
    quiz: [
      { question: 'Which keyword makes a variable constant in C?', options: ['final', 'constant', 'const', 'static'], correctAnswer: 'const' },
      { question: 'What is the difference between const and #define?', options: ['const is type-checked, #define is not', 'They are identical', '#define uses memory, const does not', 'const is faster'], correctAnswer: 'const is type-checked, #define is not' },
      { question: 'Can you change the value of a const variable?', options: ['Yes, always', 'Only in main()', 'No, it causes a compile error', 'Only with a cast'], correctAnswer: 'No, it causes a compile error' }
    ],
    codingChallenge: { problem: 'Define a constant PI using #define and calculate the circumference of a circle with radius 7 (formula: 2 * PI * r).', input: 'None', output: '43.98', example: '#include <stdio.h>\n#define PI 3.14159\nint main() {\n    float r = 7;\n    printf("%.2f", 2 * PI * r);\n    return 0;\n}' }
  },
  6: {
    theory: {
      content: 'Input and Output (I/O) in C is handled by the stdio.h library. printf() displays output to the screen using format specifiers: %d for integers, %f for floats, %c for characters, %s for strings. scanf() reads input from the user and stores it in variables using the & (address-of) operator.',
      syntax: `printf("format_string", variables);\nscanf("format_string", &variable);`,
      codeExample: `#include <stdio.h>\n\nint main() {\n    int age;\n    char name[50];\n    \n    printf("Enter your name: ");\n    scanf("%s", name);\n    \n    printf("Enter your age: ");\n    scanf("%d", &age);\n    \n    printf("Hello %s, you are %d years old!\\n", name, age);\n    return 0;\n}`
    },
    quiz: [
      { question: 'Which format specifier is used for integers in printf?', options: ['%f', '%d', '%c', '%s'], correctAnswer: '%d' },
      { question: 'Why do we use & in scanf?', options: ['To multiply', 'To get the address of the variable', 'To format output', 'To declare a pointer'], correctAnswer: 'To get the address of the variable' },
      { question: 'What does %f display?', options: ['Integer', 'String', 'Floating-point number', 'Character'], correctAnswer: 'Floating-point number' }
    ],
    codingChallenge: { problem: 'Write a program that reads two integers from the user and prints their sum.', input: '5 3', output: 'Sum: 8', example: '#include <stdio.h>\nint main() {\n    int a, b;\n    scanf("%d %d", &a, &b);\n    printf("Sum: %d", a + b);\n    return 0;\n}' }
  },
  7: {
    theory: {
      content: 'Arithmetic operators perform mathematical operations: + (addition), - (subtraction), * (multiplication), / (division), % (modulus/remainder). Integer division truncates the decimal part. The modulus operator returns the remainder after division and only works with integers.',
      syntax: `result = a + b;   // addition\nresult = a - b;   // subtraction\nresult = a * b;   // multiplication\nresult = a / b;   // division\nresult = a % b;   // modulus`,
      codeExample: `#include <stdio.h>\n\nint main() {\n    int a = 17, b = 5;\n    \n    printf("Sum: %d\\n", a + b);       // 22\n    printf("Difference: %d\\n", a - b); // 12\n    printf("Product: %d\\n", a * b);    // 85\n    printf("Quotient: %d\\n", a / b);   // 3 (integer division!)\n    printf("Remainder: %d\\n", a % b);  // 2\n    return 0;\n}`
    },
    quiz: [
      { question: 'What is the result of 7 / 2 in integer arithmetic?', options: ['3.5', '3', '4', '2'], correctAnswer: '3' },
      { question: 'What does the % operator return?', options: ['Percentage', 'Quotient', 'Remainder', 'Power'], correctAnswer: 'Remainder' },
      { question: 'What is 10 % 3?', options: ['3', '1', '0', '10'], correctAnswer: '1' }
    ],
    codingChallenge: { problem: 'Write a program that takes two integers and prints their sum, difference, product, quotient, and remainder.', input: '10 3', output: 'Sum: 13\nDiff: 7\nProduct: 30\nQuotient: 3\nRemainder: 1', example: '#include <stdio.h>\nint main() {\n    int a = 10, b = 3;\n    printf("Sum: %d\\nDiff: %d\\nProduct: %d\\nQuotient: %d\\nRemainder: %d", a+b, a-b, a*b, a/b, a%b);\n    return 0;\n}' }
  },
  8: {
    theory: {
      content: 'Relational operators compare two values and return 1 (true) or 0 (false): == (equal), != (not equal), > (greater), < (less), >= (greater or equal), <= (less or equal). Logical operators combine conditions: && (AND), || (OR), ! (NOT). These are essential for decision-making in programs.',
      syntax: `a == b   // equal to\na != b   // not equal to\na > b    // greater than\na && b   // logical AND\na || b   // logical OR\n!a       // logical NOT`,
      codeExample: `#include <stdio.h>\n\nint main() {\n    int a = 10, b = 20;\n    \n    printf("a == b: %d\\n", a == b);  // 0 (false)\n    printf("a < b: %d\\n", a < b);    // 1 (true)\n    printf("a != b: %d\\n", a != b);  // 1 (true)\n    \n    int x = 5;\n    printf("x > 0 && x < 10: %d\\n", x > 0 && x < 10); // 1\n    printf("x > 10 || x < 3: %d\\n", x > 10 || x < 3);  // 0\n    return 0;\n}`
    },
    quiz: [
      { question: 'What does == do in C?', options: ['Assigns a value', 'Checks equality', 'Declares a variable', 'Adds numbers'], correctAnswer: 'Checks equality' },
      { question: 'What is the result of (5 > 3) && (2 > 8)?', options: ['1', '0', 'true', 'error'], correctAnswer: '0' },
      { question: 'What does ! (NOT) operator do?', options: ['Multiplies', 'Reverses boolean value', 'Checks equality', 'Nothing'], correctAnswer: 'Reverses boolean value' }
    ],
    codingChallenge: { problem: 'Write a program that checks if a number is between 1 and 100 (inclusive) using logical operators.', input: '50', output: 'Yes, 50 is between 1 and 100', example: '#include <stdio.h>\nint main() {\n    int n = 50;\n    if (n >= 1 && n <= 100)\n        printf("Yes, %d is between 1 and 100", n);\n    return 0;\n}' }
  },
  9: {
    theory: {
      content: 'Type casting converts a value from one data type to another. Implicit casting happens automatically when the compiler converts a smaller type to a larger one (e.g., int to float). Explicit casting is done manually using the cast operator (type) to force conversion, which is important when you need precision control.',
      syntax: `// Implicit casting\nfloat f = 5;          // int 5 becomes 5.0\n\n// Explicit casting\nint a = (int) 3.14;   // becomes 3\nfloat b = (float) 7/2; // becomes 3.5`,
      codeExample: `#include <stdio.h>\n\nint main() {\n    int a = 7, b = 2;\n    \n    // Without casting (integer division)\n    printf("7/2 = %d\\n", a / b);          // 3\n    \n    // With casting (float division)\n    printf("7/2 = %.2f\\n", (float)a / b); // 3.50\n    \n    double pi = 3.14159;\n    int truncated = (int)pi;\n    printf("Truncated: %d\\n", truncated);  // 3\n    return 0;\n}`
    },
    quiz: [
      { question: 'What is implicit type casting?', options: ['Manual conversion by programmer', 'Automatic conversion by compiler', 'Type checking at runtime', 'Error handling'], correctAnswer: 'Automatic conversion by compiler' },
      { question: 'What is the result of (int)3.99?', options: ['4', '3', '3.99', 'Error'], correctAnswer: '3' },
      { question: 'When is explicit casting necessary?', options: ['Always', 'When you want to prevent data loss', 'When converting larger to smaller type', 'Never'], correctAnswer: 'When converting larger to smaller type' }
    ],
    codingChallenge: { problem: 'Write a program that divides two integers (7 and 3) and prints the result as both integer and float using type casting.', input: 'None', output: 'Integer: 2\nFloat: 2.33', example: '#include <stdio.h>\nint main() {\n    int a = 7, b = 3;\n    printf("Integer: %d\\n", a/b);\n    printf("Float: %.2f\\n", (float)a/b);\n    return 0;\n}' }
  },
  10: {
    theory: {
      content: 'The if statement executes a block of code only when a condition is true. The condition is placed inside parentheses and must evaluate to a non-zero value (true) for the block to execute. If statements allow programs to make decisions and execute different code paths based on conditions.',
      syntax: `if (condition) {\n    // code to execute if true\n}`,
      codeExample: `#include <stdio.h>\n\nint main() {\n    int age = 18;\n    \n    if (age >= 18) {\n        printf("You are eligible to vote.\\n");\n    }\n    \n    int score = 85;\n    if (score > 90) {\n        printf("Excellent!\\n");\n    }\n    if (score > 70) {\n        printf("Good job!\\n");\n    }\n    return 0;\n}`
    },
    quiz: [
      { question: 'What value does a true condition have in C?', options: ['true', '1 (non-zero)', '"yes"', 'TRUE'], correctAnswer: '1 (non-zero)' },
      { question: 'What happens if the if condition is 0?', options: ['Code executes', 'Code is skipped', 'Error occurs', 'Program exits'], correctAnswer: 'Code is skipped' },
      { question: 'Are curly braces required for single-statement if?', options: ['Yes, always', 'No, but recommended', 'Only in main()', 'Only for loops'], correctAnswer: 'No, but recommended' }
    ],
    codingChallenge: { problem: 'Write a program that checks if a number is positive and prints "Positive" if it is.', input: '5', output: 'Positive', example: '#include <stdio.h>\nint main() {\n    int n = 5;\n    if (n > 0) printf("Positive");\n    return 0;\n}' }
  },
};

// ────────────────────────────────────────────
// PYTHON CONTENT
// ────────────────────────────────────────────
const pythonContent: { [level: number]: Omit<LevelContent, 'title' | 'topic' | 'difficulty'> } = {
  1: {
    theory: {
      content: 'Python is a high-level, interpreted programming language created by Guido van Rossum in 1991. Known for its clean syntax and readability, Python uses indentation instead of braces to define code blocks. It supports multiple paradigms including procedural, object-oriented, and functional programming.',
      syntax: `# Python uses indentation\nprint("Hello")\n\n# No semicolons needed\n# No curly braces for blocks`,
      codeExample: `# Your first Python program\nprint("Hello, World!")\nprint("Welcome to Python!")\n\n# Variables don't need type declaration\nname = "Alice"\nage = 30\nprint(f"I'm {name}, age {age}")`
    },
    quiz: [
      { question: 'Who created Python?', options: ['Dennis Ritchie', 'Guido van Rossum', 'James Gosling', 'Brendan Eich'], correctAnswer: 'Guido van Rossum' },
      { question: 'What defines code blocks in Python?', options: ['Curly braces', 'Parentheses', 'Indentation', 'Semicolons'], correctAnswer: 'Indentation' },
      { question: 'What function displays output in Python?', options: ['echo()', 'console.log()', 'printf()', 'print()'], correctAnswer: 'print()' }
    ],
    codingChallenge: { problem: 'Write a Python program that prints "Hello, CodeClimb!" on the first line and your name on the second line.', input: 'None', output: 'Hello, CodeClimb!\nAlice', example: 'print("Hello, CodeClimb!")\nprint("Alice")' }
  },
  2: {
    theory: {
      content: 'Variables in Python are created the moment you assign a value. No declaration or type keyword is needed — Python automatically determines the type. Variable names must start with a letter or underscore, are case-sensitive, and cannot be Python keywords. You can reassign variables to different types freely.',
      syntax: `variable_name = value\nx = 10          # integer\ny = 3.14        # float\nname = "Hello"  # string\nis_ok = True    # boolean`,
      codeExample: `# Variables in Python\nname = "John"\nage = 25\nheight = 5.9\nis_student = True\n\nprint(name)       # John\nprint(type(age))  # <class 'int'>\n\n# Reassignment\nage = 26\nprint(age)        # 26\n\n# Multiple assignment\na, b, c = 1, 2, 3`
    },
    quiz: [
      { question: 'Do you need to declare variable types in Python?', options: ['Yes, always', 'No, Python infers them', 'Only for integers', 'Only for strings'], correctAnswer: 'No, Python infers them' },
      { question: 'Which is a valid variable name?', options: ['2name', 'my-var', '_count', 'class'], correctAnswer: '_count' },
      { question: 'What does type(x) return?', options: ['The value of x', 'The data type of x', 'The size of x', 'An error'], correctAnswer: 'The data type of x' }
    ],
    codingChallenge: { problem: 'Create variables for your name (string), age (int), and height (float), then print all three.', input: 'None', output: 'Alice\n25\n5.6', example: 'name = "Alice"\nage = 25\nheight = 5.6\nprint(name)\nprint(age)\nprint(height)' }
  },
  3: {
    theory: {
      content: 'Python has several built-in data types: int (whole numbers), float (decimals), str (text strings), bool (True/False), NoneType (None). You can check a variable\'s type using type() and convert between types using int(), float(), str(), bool(). Python supports arbitrarily large integers.',
      syntax: `# Type checking\ntype(variable)\n\n# Type conversion\nint("42")    # string to int\nfloat("3.14") # string to float\nstr(100)     # int to string\nbool(1)      # int to bool`,
      codeExample: `# Data types\nwhole = 42           # int\ndecimal = 3.14       # float\ntext = "Hello"       # str\nflag = True          # bool\nnothing = None       # NoneType\n\nprint(type(whole))   # <class 'int'>\nprint(type(text))    # <class 'str'>\n\n# Conversion\nnum_str = "100"\nnum = int(num_str)\nprint(num + 50)      # 150`
    },
    quiz: [
      { question: 'What type is the value True in Python?', options: ['int', 'str', 'bool', 'bit'], correctAnswer: 'bool' },
      { question: 'What does int("42") return?', options: ['"42"', '42', 'Error', 'None'], correctAnswer: '42' },
      { question: 'What is None in Python?', options: ['Zero', 'Empty string', 'Absence of value', 'False'], correctAnswer: 'Absence of value' }
    ],
    codingChallenge: { problem: 'Convert the string "25" to an integer, add 10, and print the result.', input: 'None', output: '35', example: 'x = int("25")\nprint(x + 10)' }
  },
};

// ────────────────────────────────────────────
// JAVASCRIPT CONTENT
// ────────────────────────────────────────────
const jsContent: { [level: number]: Omit<LevelContent, 'title' | 'topic' | 'difficulty'> } = {
  1: {
    theory: {
      content: 'JavaScript is a high-level, dynamic programming language created by Brendan Eich in 1995. It is the language of the web — running in every browser. JavaScript enables interactive web pages and with Node.js, can also power servers. It supports event-driven, functional, and object-oriented programming styles.',
      syntax: `// Single-line comment\n/* Multi-line comment */\n\nconsole.log("Hello");\nalert("Welcome!");`,
      codeExample: `// Your first JavaScript program\nconsole.log("Hello, World!");\n\n// Variables\nlet name = "Alice";\nconst age = 25;\nvar isStudent = true;\n\nconsole.log("Name: " + name);\nconsole.log(\`Age: \${age}\`);`
    },
    quiz: [
      { question: 'Who created JavaScript?', options: ['Dennis Ritchie', 'Guido van Rossum', 'Brendan Eich', 'James Gosling'], correctAnswer: 'Brendan Eich' },
      { question: 'What method logs to the browser console?', options: ['print()', 'console.log()', 'System.out.println()', 'echo()'], correctAnswer: 'console.log()' },
      { question: 'Where does JavaScript primarily run?', options: ['Only on servers', 'In web browsers', 'Only in terminals', 'In databases'], correctAnswer: 'In web browsers' }
    ],
    codingChallenge: { problem: 'Write JavaScript code that declares a variable called "greeting" with value "Hello, CodeClimb!" and logs it to the console.', input: 'None', output: 'Hello, CodeClimb!', example: 'let greeting = "Hello, CodeClimb!";\nconsole.log(greeting);' }
  },
  2: {
    theory: {
      content: 'JavaScript has three ways to declare variables: let (block-scoped, reassignable), const (block-scoped, not reassignable), and var (function-scoped, older style). Modern JavaScript prefers const by default and let when reassignment is needed. var is generally avoided due to its confusing scoping rules.',
      syntax: `let x = 10;     // can be reassigned\nconst y = 20;   // cannot be reassigned\nvar z = 30;     // old style, avoid`,
      codeExample: `// let - use when value changes\nlet score = 0;\nscore = 10; // OK\n\n// const - use for fixed values\nconst PI = 3.14159;\n// PI = 3; // ERROR!\n\n// var - avoid in modern JS\nvar name = "old style";\n\nconsole.log(score, PI);`
    },
    quiz: [
      { question: 'Which keyword creates a constant variable?', options: ['let', 'var', 'const', 'final'], correctAnswer: 'const' },
      { question: 'Can you reassign a let variable?', options: ['Yes', 'No', 'Only numbers', 'Only strings'], correctAnswer: 'Yes' },
      { question: 'Why is var generally avoided?', options: ['It is slower', 'It has confusing scoping', 'It cannot hold strings', 'It is deprecated'], correctAnswer: 'It has confusing scoping' }
    ],
    codingChallenge: { problem: 'Declare a const for your birth year, a let for your current age, and log both.', input: 'None', output: '2000\n25', example: 'const birthYear = 2000;\nlet age = 25;\nconsole.log(birthYear);\nconsole.log(age);' }
  },
};

// ────────────────────────────────────────────
// JAVA CONTENT
// ────────────────────────────────────────────
const javaContent: { [level: number]: Omit<LevelContent, 'title' | 'topic' | 'difficulty'> } = {
  1: {
    theory: {
      content: 'Java is a high-level, object-oriented programming language created by James Gosling at Sun Microsystems in 1995. Its "Write Once, Run Anywhere" philosophy means Java code compiles to bytecode that runs on any Java Virtual Machine (JVM). Java is strongly typed, class-based, and widely used for enterprise and Android development.',
      syntax: `public class ClassName {\n    public static void main(String[] args) {\n        // code here\n    }\n}`,
      codeExample: `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        System.out.println("Welcome to Java!");\n    }\n}`
    },
    quiz: [
      { question: 'Who created Java?', options: ['Dennis Ritchie', 'James Gosling', 'Guido van Rossum', 'Bjarne Stroustrup'], correctAnswer: 'James Gosling' },
      { question: 'What does JVM stand for?', options: ['Java Very Modern', 'Java Virtual Machine', 'Java Version Manager', 'Java Variable Memory'], correctAnswer: 'Java Virtual Machine' },
      { question: 'What is the correct method to print output in Java?', options: ['print()', 'console.log()', 'System.out.println()', 'printf()'], correctAnswer: 'System.out.println()' }
    ],
    codingChallenge: { problem: 'Write a Java program that prints "Hello, CodeClimb!" to the console.', input: 'None', output: 'Hello, CodeClimb!', example: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeClimb!");\n    }\n}' }
  },
};

// ────────────────────────────────────────────
// C++ CONTENT
// ────────────────────────────────────────────
const cppContent: { [level: number]: Omit<LevelContent, 'title' | 'topic' | 'difficulty'> } = {
  1: {
    theory: {
      content: 'C++ is a general-purpose programming language created by Bjarne Stroustrup in 1979 as an extension of C. It adds object-oriented features while maintaining C\'s performance and low-level capabilities. C++ is used in game engines, operating systems, browsers, and performance-critical applications.',
      syntax: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "text" << endl;\n    return 0;\n}`,
      codeExample: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    cout << "Welcome to C++!" << endl;\n    return 0;\n}`
    },
    quiz: [
      { question: 'Who created C++?', options: ['Dennis Ritchie', 'Bjarne Stroustrup', 'James Gosling', 'Guido van Rossum'], correctAnswer: 'Bjarne Stroustrup' },
      { question: 'What header is needed for cout?', options: ['<stdio.h>', '<iostream>', '<conio.h>', '<string>'], correctAnswer: '<iostream>' },
      { question: 'What does endl do?', options: ['Ends the program', 'Inserts a new line', 'Clears the screen', 'Pauses output'], correctAnswer: 'Inserts a new line' }
    ],
    codingChallenge: { problem: 'Write a C++ program that prints "Hello, CodeClimb!" using cout.', input: 'None', output: 'Hello, CodeClimb!', example: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, CodeClimb!" << endl;\n    return 0;\n}' }
  },
};

// ────────────────────────────────────────────
// HTML CONTENT
// ────────────────────────────────────────────
const htmlContent: { [level: number]: Omit<LevelContent, 'title' | 'topic' | 'difficulty'> } = {
  1: {
    theory: {
      content: 'HTML (HyperText Markup Language) is the standard language for creating web pages. It uses tags to define the structure and content of a page. Tags are enclosed in angle brackets and usually come in pairs: an opening tag <tag> and a closing tag </tag>. HTML tells the browser what to display, not how to style it.',
      syntax: `<!DOCTYPE html>\n<html>\n<head>\n    <title>Page Title</title>\n</head>\n<body>\n    <!-- content goes here -->\n</body>\n</html>`,
      codeExample: `<!DOCTYPE html>\n<html>\n<head>\n    <title>My First Page</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n    <p>This is my first web page.</p>\n</body>\n</html>`
    },
    quiz: [
      { question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Markup Language'], correctAnswer: 'HyperText Markup Language' },
      { question: 'Which tag defines the largest heading?', options: ['<heading>', '<h6>', '<h1>', '<head>'], correctAnswer: '<h1>' },
      { question: 'What does <!DOCTYPE html> declare?', options: ['A comment', 'The document is HTML5', 'A variable', 'A style rule'], correctAnswer: 'The document is HTML5' }
    ],
    codingChallenge: { problem: 'Create a basic HTML page with a title "My Page" and an h1 heading that says "Welcome".', input: 'None', output: 'A page with heading "Welcome"', example: '<!DOCTYPE html>\n<html>\n<head><title>My Page</title></head>\n<body><h1>Welcome</h1></body>\n</html>' }
  },
};

// ────────────────────────────────────────────
// CSS CONTENT
// ────────────────────────────────────────────
const cssContent: { [level: number]: Omit<LevelContent, 'title' | 'topic' | 'difficulty'> } = {
  1: {
    theory: {
      content: 'CSS (Cascading Style Sheets) controls the visual presentation of HTML documents — colors, fonts, spacing, layout, and animations. CSS separates content (HTML) from design, making websites easier to maintain. Styles can be applied inline, internally via <style> tags, or externally via .css files.',
      syntax: `selector {\n    property: value;\n    property: value;\n}`,
      codeExample: `/* External CSS */\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n    margin: 0;\n    padding: 20px;\n}\n\nh1 {\n    color: #333;\n    text-align: center;\n}\n\np {\n    color: #666;\n    line-height: 1.6;\n}`
    },
    quiz: [
      { question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Syntax', 'Colorful Style System'], correctAnswer: 'Cascading Style Sheets' },
      { question: 'Which method of applying CSS is most recommended?', options: ['Inline styles', 'Internal <style> tag', 'External stylesheet', 'JavaScript'], correctAnswer: 'External stylesheet' },
      { question: 'What separates CSS from HTML?', options: ['CSS handles structure, HTML handles style', 'CSS handles style, HTML handles structure', 'They do the same thing', 'CSS is a programming language'], correctAnswer: 'CSS handles style, HTML handles structure' }
    ],
    codingChallenge: { problem: 'Write CSS to make all h1 elements blue and centered.', input: 'None', output: 'Blue centered headings', example: 'h1 {\n    color: blue;\n    text-align: center;\n}' }
  },
};

// ────────────────────────────────────────────
// Language content maps
// ────────────────────────────────────────────
const contentMaps: { [lang: string]: { [level: number]: Omit<LevelContent, 'title' | 'topic' | 'difficulty'> } } = {
  c: cContent,
  python: pythonContent,
  javascript: jsContent,
  java: javaContent,
  'c++': cppContent,
  html: htmlContent,
  css: cssContent,
};

// ────────────────────────────────────────────
// SMART FALLBACK GENERATOR
// ────────────────────────────────────────────
function generateFallbackContent(language: string, topic: string, level: number, difficulty: string): Omit<LevelContent, 'title' | 'topic' | 'difficulty'> {
  const lang = language.toUpperCase();

  return {
    theory: {
      content: `In this level, you'll learn about ${topic} in ${lang}. ${topic} is ${difficulty === 'Beginner' ? 'a fundamental concept' : difficulty === 'Intermediate' ? 'an important intermediate concept' : 'an advanced concept'} that builds on your previous knowledge. Understanding ${topic} will help you write more efficient and professional ${lang} code.`,
      syntax: `// ${topic} syntax in ${lang}\n// Refer to official documentation for complete syntax`,
      codeExample: `// Example: ${topic} in ${lang}\n// Level ${level}\n// Practice this concept thoroughly!`
    },
    quiz: [
      {
        question: `What is the primary purpose of ${topic} in ${lang}?`,
        options: [
          `To organize and structure ${lang} code effectively`,
          'To make the program run slower',
          'It has no real purpose',
          'To create compilation errors'
        ],
        correctAnswer: `To organize and structure ${lang} code effectively`
      },
      {
        question: `When should you use ${topic}?`,
        options: [
          'Never',
          `When the ${lang} program requires this specific functionality`,
          'Only in testing',
          'Only in comments'
        ],
        correctAnswer: `When the ${lang} program requires this specific functionality`
      },
      {
        question: `Which best describes ${topic}?`,
        options: [
          `A ${difficulty.toLowerCase()}-level concept in ${lang}`,
          'An outdated feature',
          'Only available in Python',
          'A type of hardware'
        ],
        correctAnswer: `A ${difficulty.toLowerCase()}-level concept in ${lang}`
      }
    ],
    codingChallenge: {
      problem: `Write a ${lang} program that demonstrates the use of ${topic}.`,
      input: 'Varies based on implementation',
      output: 'Correct use of ' + topic,
      example: `// Implement ${topic} in ${lang}\n// This is a practice exercise`
    }
  };
}

// ────────────────────────────────────────────
// MAIN EXPORT
// ────────────────────────────────────────────
export const generateLevelContent = (language: string, level: number): LevelContent => {
  const lang = language.toLowerCase();
  const topic = getTopic(lang, level);
  const difficulty = getDifficulty(level);
  const title = `Level ${level} – ${topic}`;

  const contentMap = contentMaps[lang];
  const specificContent = contentMap?.[level];

  const content = specificContent || generateFallbackContent(language, topic, level, difficulty);

  return {
    title,
    topic,
    difficulty,
    ...content,
  };
};
