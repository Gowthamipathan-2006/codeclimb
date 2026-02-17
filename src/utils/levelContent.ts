
import { getTopic, getDifficulty } from './curriculum';
import { supabase } from '@/integrations/supabase/client';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface TestCase {
  input: string;
  output: string;
}

export interface CodingChallenge {
  problem: string;
  tasks: string[];
  constraints?: string[];
  testCases: TestCase[];
  hints: string[];
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
// C LANGUAGE CONTENT (hand-crafted levels 1-10)
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
    codingChallenge: {
      problem: 'Write a C program that prints "Hello, CodeClimb!" to the console.',
      tasks: ['Include the stdio.h header', 'Write a main function', 'Use printf to print "Hello, CodeClimb!"'],
      testCases: [{ input: 'None', output: 'Hello, CodeClimb!' }],
      hints: ['Use the printf() function for output', 'Don\'t forget the newline character \\n']
    }
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
    codingChallenge: {
      problem: 'Write a C program that prints your name and age on separate lines.',
      tasks: ['Create a main function with proper structure', 'Print your name on line 1', 'Print your age on line 2'],
      testCases: [{ input: 'None', output: 'Alice\n25' }],
      hints: ['Use two separate printf statements', 'Use \\n to create a new line']
    }
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
    codingChallenge: {
      problem: 'Declare an integer variable called "score" with value 100 and print it.',
      tasks: ['Declare an int variable named score', 'Assign the value 100', 'Print the variable using printf with %d'],
      testCases: [{ input: 'None', output: '100' }],
      hints: ['Use the %d format specifier for integers', 'Remember to declare the variable before using it']
    }
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
    codingChallenge: {
      problem: 'Create variables of each basic type (int, float, double, char) and print their sizes using sizeof().',
      tasks: ['Declare one variable of each type', 'Use sizeof() to get the size of each type', 'Print each size using printf'],
      constraints: ['Use all four basic types: int, float, double, char'],
      testCases: [{ input: 'None', output: 'Size of int: 4 bytes\nSize of float: 4 bytes\nSize of double: 8 bytes\nSize of char: 1 byte' }],
      hints: ['sizeof() returns the number of bytes a type uses', 'Use %lu format specifier for sizeof results']
    }
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
    codingChallenge: {
      problem: 'Define a constant PI using #define and calculate the circumference of a circle with radius 7.',
      tasks: ['Define PI as 3.14159 using #define', 'Set radius to 7', 'Calculate circumference using 2 * PI * r', 'Print the result'],
      constraints: ['Use #define for PI, not const', 'Formula: circumference = 2 * PI * radius'],
      testCases: [{ input: 'None', output: 'Circumference: 43.98' }],
      hints: ['#define is placed before the main function', 'Use %.2f to print two decimal places']
    }
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
    codingChallenge: {
      problem: 'Write a program that reads two integers from the user and prints their sum.',
      tasks: ['Declare two integer variables', 'Read values using scanf', 'Calculate and print the sum'],
      testCases: [{ input: '5 3', output: '8' }, { input: '10 20', output: '30' }],
      hints: ['Use & before variable names in scanf', 'Use %d for reading and printing integers']
    }
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
    codingChallenge: {
      problem: 'Write a program that takes two integers and prints their sum, difference, product, quotient, and remainder.',
      tasks: ['Read two integers', 'Compute all five operations', 'Print each result on a separate line'],
      testCases: [{ input: '10 3', output: 'Sum: 13\nDifference: 7\nProduct: 30\nQuotient: 3\nRemainder: 1' }],
      hints: ['Use / for integer division and % for remainder', 'Integer division truncates the decimal part']
    }
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
    codingChallenge: {
      problem: 'Write a program that checks if a number is between 1 and 100 (inclusive) using logical operators.',
      tasks: ['Read an integer from the user', 'Check if it is >= 1 AND <= 100', 'Print "In range" or "Out of range"'],
      testCases: [{ input: '50', output: 'In range' }, { input: '150', output: 'Out of range' }, { input: '1', output: 'In range' }],
      hints: ['Use the && (AND) operator to combine two conditions', 'Both conditions must be true for the number to be in range']
    }
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
    codingChallenge: {
      problem: 'Write a program that divides two integers (7 and 3) and prints the result as both integer and float using type casting.',
      tasks: ['Declare two int variables with values 7 and 3', 'Print integer division result', 'Use explicit casting to print float division result'],
      testCases: [{ input: 'None', output: 'Integer: 2\nFloat: 2.33' }],
      hints: ['Cast one operand to float before dividing: (float)a / b', 'Use %.2f for float output']
    }
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
    codingChallenge: {
      problem: 'Write a program that checks if a number is positive and prints "Positive" if it is.',
      tasks: ['Read an integer from the user', 'Use an if statement to check if it is greater than 0', 'Print "Positive" if the condition is true'],
      testCases: [{ input: '5', output: 'Positive' }, { input: '-3', output: '' }],
      hints: ['The if condition checks (number > 0)', 'No else is needed — just skip output if not positive']
    }
  },
};

// ────────────────────────────────────────────
// PYTHON CONTENT (hand-crafted levels 1-3)
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
    codingChallenge: {
      problem: 'Write a Python program that prints "Hello, CodeClimb!" on the first line and your name on the second line.',
      tasks: ['Use the print() function twice', 'First print "Hello, CodeClimb!"', 'Then print your name'],
      testCases: [{ input: 'None', output: 'Hello, CodeClimb!\nAlice' }],
      hints: ['Each print() automatically adds a newline', 'Strings go inside quotes']
    }
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
    codingChallenge: {
      problem: 'Create variables for your name (string), age (int), and height (float), then print all three.',
      tasks: ['Create a string variable for name', 'Create an int variable for age', 'Create a float variable for height', 'Print all three variables'],
      testCases: [{ input: 'None', output: 'Alice\n25\n5.9' }],
      hints: ['Python infers the type from the assigned value', 'Use print() for each variable']
    }
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
    codingChallenge: {
      problem: 'Convert the string "25" to an integer, add 10, and print the result.',
      tasks: ['Store "25" in a variable', 'Convert it to int using int()', 'Add 10 to the result', 'Print the final value'],
      testCases: [{ input: 'None', output: '35' }],
      hints: ['int() converts a string to an integer', 'You can do arithmetic after conversion']
    }
  },
};

// ────────────────────────────────────────────
// JAVASCRIPT CONTENT (hand-crafted levels 1-2)
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
    codingChallenge: {
      problem: 'Write JavaScript code that declares a variable called "greeting" with value "Hello, CodeClimb!" and logs it to the console.',
      tasks: ['Declare a variable using let or const', 'Assign "Hello, CodeClimb!" as its value', 'Log the variable using console.log()'],
      testCases: [{ input: 'None', output: 'Hello, CodeClimb!' }],
      hints: ['Use const if the value won\'t change', 'console.log() prints to the browser console']
    }
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
    codingChallenge: {
      problem: 'Declare a const for your birth year, a let for your current age, and log both.',
      tasks: ['Use const for birth year', 'Use let for current age', 'Log both values using console.log()'],
      testCases: [{ input: 'None', output: '2000\n25' }],
      hints: ['const cannot be reassigned after declaration', 'let allows reassignment if needed later']
    }
  },
};

// ────────────────────────────────────────────
// JAVA CONTENT (hand-crafted level 1)
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
    codingChallenge: {
      problem: 'Write a Java program that prints "Hello, CodeClimb!" to the console.',
      tasks: ['Create a class with a main method', 'Use System.out.println() to print the message'],
      testCases: [{ input: 'None', output: 'Hello, CodeClimb!' }],
      hints: ['The class name must match the file name', 'main method signature: public static void main(String[] args)']
    }
  },
};

// ────────────────────────────────────────────
// C++ CONTENT (hand-crafted level 1)
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
    codingChallenge: {
      problem: 'Write a C++ program that prints "Hello, CodeClimb!" using cout.',
      tasks: ['Include the iostream header', 'Use cout with << to print the message', 'End with endl for a newline'],
      testCases: [{ input: 'None', output: 'Hello, CodeClimb!' }],
      hints: ['cout is part of the std namespace', 'Use << to chain output']
    }
  },
};

// ────────────────────────────────────────────
// HTML CONTENT (hand-crafted level 1)
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
    codingChallenge: {
      problem: 'Create a basic HTML page with a title "My Page" and an h1 heading that says "Welcome".',
      tasks: ['Add the DOCTYPE declaration', 'Create html, head, and body tags', 'Add a title tag with "My Page"', 'Add an h1 tag with "Welcome"'],
      testCases: [{ input: 'None', output: 'Page displays "Welcome" as a heading' }],
      hints: ['Every HTML page needs html, head, and body tags', 'The title tag goes inside head']
    }
  },
};

// ────────────────────────────────────────────
// CSS CONTENT (hand-crafted level 1)
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
    codingChallenge: {
      problem: 'Write CSS to make all h1 elements blue and centered.',
      tasks: ['Select all h1 elements', 'Set the color property to blue', 'Set text-align to center'],
      testCases: [{ input: 'None', output: 'All h1 headings appear blue and centered' }],
      hints: ['Use the element selector h1 { }', 'color sets text color, text-align sets alignment']
    }
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
// LOADING PLACEHOLDER
// ────────────────────────────────────────────
function getLoadingContent(topic: string, language: string): Omit<LevelContent, 'title' | 'topic' | 'difficulty'> {
  return {
    theory: {
      content: `Loading content for "${topic}" in ${language.toUpperCase()}... This may take a few seconds on first load.`,
      syntax: '// Loading...',
      codeExample: '// Loading...'
    },
    quiz: [
      { question: 'Content is loading...', options: ['Please wait', 'Loading...', 'Almost ready', 'Generating...'], correctAnswer: 'Please wait' },
      { question: 'Content is loading...', options: ['Please wait', 'Loading...', 'Almost ready', 'Generating...'], correctAnswer: 'Please wait' },
      { question: 'Content is loading...', options: ['Please wait', 'Loading...', 'Almost ready', 'Generating...'], correctAnswer: 'Please wait' },
    ],
    codingChallenge: {
      problem: 'Loading...',
      tasks: ['Please wait for content to generate'],
      testCases: [{ input: 'None', output: 'Loading...' }],
      hints: ['Content is being generated']
    }
  };
}

// ────────────────────────────────────────────
// MAIN GENERATOR (synchronous for hand-crafted, returns loading for AI)
// ────────────────────────────────────────────
export function generateLevelContent(language: string, level: number): LevelContent {
  const lang = language.toLowerCase();
  const topic = getTopic(lang, level);
  const difficulty = getDifficulty(level);

  const handCrafted = contentMaps[lang]?.[level];
  const base = handCrafted || getLoadingContent(topic, lang);

  return {
    title: `${topic} – ${difficulty}`,
    topic,
    difficulty,
    ...base,
  };
}

// ────────────────────────────────────────────
// ASYNC FETCHER for AI-generated content
// ────────────────────────────────────────────
export async function fetchLevelContent(language: string, level: number): Promise<LevelContent | null> {
  const lang = language.toLowerCase();
  const topic = getTopic(lang, level);
  const difficulty = getDifficulty(level);

  // If hand-crafted content exists, no need to fetch
  if (contentMaps[lang]?.[level]) {
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-level-content', {
      body: { language: lang, level, topic, difficulty },
    });

    if (error) throw error;

    return {
      title: `${topic} – ${difficulty}`,
      topic,
      difficulty,
      theory: data.theory,
      quiz: data.quiz,
      codingChallenge: data.codingChallenge,
    };
  } catch (err) {
    console.error('Failed to fetch AI content:', err);
    return null;
  }
}

// Check if a level has hand-crafted content
export function hasHandCraftedContent(language: string, level: number): boolean {
  return !!contentMaps[language.toLowerCase()]?.[level];
}
