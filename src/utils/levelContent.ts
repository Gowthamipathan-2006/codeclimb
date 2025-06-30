
interface LevelContent {
  title: string;
  theory: {
    content: string;
    codeExample?: string;
  };
  exam: {
    question: string;
    options: string[];
    correctAnswer: string;
  };
}

const languageContent: { [key: string]: { [level: number]: LevelContent } } = {
  'c': {
    1: {
      title: 'Introduction to C Programming',
      theory: {
        content: 'C is a general-purpose programming language created by Dennis Ritchie at Bell Labs in 1972. It is a foundational language that has influenced many modern programming languages. C programs are fast, efficient, and give you direct control over system resources.',
        codeExample: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`
      },
      exam: {
        question: 'What is the correct way to include the standard input/output library in C?',
        options: ['#include <stdio.h>', '#include <iostream>', '#include "stdio.h"', '#import stdio'],
        correctAnswer: '#include <stdio.h>'
      }
    },
    2: {
      title: 'Variables and Data Types',
      theory: {
        content: 'In C, variables are containers for storing data values. Each variable has a specific data type that determines what kind of data it can hold. Common data types include int (integers), float (floating-point numbers), char (characters), and double (double-precision floating-point).',
        codeExample: `int age = 25;
float height = 5.9;
char grade = 'A';
double salary = 50000.50;`
      },
      exam: {
        question: 'Which data type is used to store a single character in C?',
        options: ['int', 'char', 'string', 'character'],
        correctAnswer: 'char'
      }
    }
  },
  'python': {
    1: {
      title: 'Introduction to Python',
      theory: {
        content: 'Python is a high-level, interpreted programming language known for its simple syntax and readability. Created by Guido van Rossum in 1991, Python emphasizes code readability and allows programmers to express concepts in fewer lines of code than languages like C++ or Java.',
        codeExample: `print("Hello, World!")
name = "Alice"
age = 30
print(f"My name is {name} and I am {age} years old")`
      },
      exam: {
        question: 'What function is used to display output in Python?',
        options: ['print()', 'echo()', 'display()', 'output()'],
        correctAnswer: 'print()'
      }
    },
    2: {
      title: 'Variables and Data Types',
      theory: {
        content: 'Python variables don\'t need explicit declaration. The interpreter automatically determines the data type based on the value assigned. Python supports various data types including integers, floats, strings, booleans, lists, and dictionaries.',
        codeExample: `# Variables in Python
name = "John"        # string
age = 25            # integer
height = 5.9        # float
is_student = True   # boolean
colors = ["red", "green", "blue"]  # list`
      },
      exam: {
        question: 'In Python, what type of data is "Hello World"?',
        options: ['integer', 'string', 'boolean', 'float'],
        correctAnswer: 'string'
      }
    }
  },
  'javascript': {
    1: {
      title: 'Introduction to JavaScript',
      theory: {
        content: 'JavaScript is a high-level, dynamic programming language primarily used for web development. It enables interactive web pages and is an essential part of web applications. JavaScript runs in web browsers and, with Node.js, can also run on servers.',
        codeExample: `console.log("Hello, World!");
alert("Welcome to JavaScript!");

// Variables
let name = "Alice";
const age = 25;
var isStudent = true;`
      },
      exam: {
        question: 'What method is used to display output in the browser console in JavaScript?',
        options: ['console.log()', 'print()', 'display()', 'output()'],
        correctAnswer: 'console.log()'
      }
    }
  },
  'java': {
    1: {
      title: 'Introduction to Java',
      theory: {
        content: 'Java is a high-level, object-oriented programming language developed by Sun Microsystems (now Oracle) in 1995. Java is platform-independent, meaning "write once, run anywhere" (WORA). It\'s widely used for enterprise applications, Android development, and web applications.',
        codeExample: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
      },
      exam: {
        question: 'What is the main method signature in Java?',
        options: [
          'public static void main(String[] args)',
          'public void main(String args)',
          'static void main(String[] args)',
          'public main(String[] args)'
        ],
        correctAnswer: 'public static void main(String[] args)'
      }
    }
  },
  'html': {
    1: {
      title: 'Introduction to HTML',
      theory: {
        content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure and content of web pages using elements and tags. HTML documents are interpreted by web browsers to display formatted content.',
        codeExample: `<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first HTML page.</p>
</body>
</html>`
      },
      exam: {
        question: 'What does HTML stand for?',
        options: [
          'HyperText Markup Language',
          'High Tech Modern Language',
          'Home Tool Markup Language',
          'Hyperlink and Text Markup Language'
        ],
        correctAnswer: 'HyperText Markup Language'
      }
    }
  },
  'css': {
    1: {
      title: 'Introduction to CSS',
      theory: {
        content: 'CSS (Cascading Style Sheets) is a style sheet language used to describe the presentation of HTML documents. CSS controls the layout, colors, fonts, and overall visual appearance of web pages. It separates content from presentation, making web pages more flexible and maintainable.',
        codeExample: `/* CSS Example */
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

h1 {
    color: blue;
    text-align: center;
}

p {
    color: #333;
    line-height: 1.6;
}`
      },
      exam: {
        question: 'What does CSS stand for?',
        options: [
          'Cascading Style Sheets',
          'Computer Style Sheets',
          'Creative Style Sheets',
          'Colorful Style Sheets'
        ],
        correctAnswer: 'Cascading Style Sheets'
      }
    }
  },
  'c++': {
    1: {
      title: 'Introduction to C++',
      theory: {
        content: 'C++ is a general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language. It supports both procedural and object-oriented programming paradigms. C++ is widely used for system programming, game development, and applications requiring high performance.',
        codeExample: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`
      },
      exam: {
        question: 'What header file is needed for input/output operations in C++?',
        options: ['<iostream>', '<stdio.h>', '<conio.h>', '<input>'],
        correctAnswer: '<iostream>'
      }
    }
  }
};

export const generateLevelContent = (language: string, level: number): LevelContent => {
  const langContent = languageContent[language.toLowerCase()];
  
  if (langContent && langContent[level]) {
    return langContent[level];
  }
  
  // Generate default content for levels not explicitly defined
  return {
    title: `${language.toUpperCase()} Level ${level}`,
    theory: {
      content: `This is level ${level} of ${language.toUpperCase()}. In this level, you'll learn advanced concepts and continue building your programming skills. Each level builds upon the previous one, so make sure you understand the fundamentals before proceeding.`,
      codeExample: `// Example code for ${language} Level ${level}
// This is a placeholder example
console.log("Level ${level} completed!");`
    },
    exam: {
      question: `What is the most important concept in ${language.toUpperCase()} Level ${level}?`,
      options: [
        'Understanding the fundamentals',
        'Memorizing syntax',
        'Skipping to advanced topics',
        'Avoiding practice'
      ],
      correctAnswer: 'Understanding the fundamentals'
    }
  };
};
