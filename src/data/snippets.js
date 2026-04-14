// 난이도 기준:
// easy   — 짧고 단순, 특수문자 적음
// medium — 중간 길이, 괄호/세미콜론 포함
// hard   — 긴 코드, 중첩 구조, 특수문자 다수

const snippets = [
  // ===== Python =====
  {
    id: "py-001",
    language: "python",
    difficulty: "easy",
    title: "Hello World",
    code: `print("Hello, World!")`,
  },
  {
    id: "py-002",
    language: "python",
    difficulty: "easy",
    title: "변수와 출력",
    code: `name = "Dojo"
age = 25
print(f"Name: {name}, Age: {age}")`,
  },
  {
    id: "py-003",
    language: "python",
    difficulty: "easy",
    title: "리스트 순회",
    code: `fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)`,
  },
  {
    id: "py-004",
    language: "python",
    difficulty: "medium",
    title: "딕셔너리 컴프리헨션",
    code: `scores = {"alice": 85, "bob": 92, "charlie": 78}
passed = {k: v for k, v in scores.items() if v >= 80}
print(passed)`,
  },
  {
    id: "py-005",
    language: "python",
    difficulty: "medium",
    title: "함수 데코레이터",
    code: `def timer(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"{func.__name__}: {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_add(a, b):
    import time
    time.sleep(0.1)
    return a + b`,
  },
  {
    id: "py-006",
    language: "python",
    difficulty: "hard",
    title: "클래스 상속과 매직 메서드",
    code: `class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

    @property
    def magnitude(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5

v1 = Vector(3, 4)
v2 = Vector(1, 2)
print(v1 + v2)
print(f"Magnitude: {v1.magnitude:.2f}")`,
  },

  // ===== JavaScript =====
  {
    id: "js-001",
    language: "javascript",
    difficulty: "easy",
    title: "Console Log",
    code: `console.log("Hello, World!");`,
  },
  {
    id: "js-002",
    language: "javascript",
    difficulty: "easy",
    title: "화살표 함수",
    code: `const greet = (name) => {
  return \`Hello, \${name}!\`;
};

console.log(greet("Dojo"));`,
  },
  {
    id: "js-003",
    language: "javascript",
    difficulty: "medium",
    title: "배열 메서드 체이닝",
    code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const result = numbers
  .filter((n) => n % 2 === 0)
  .map((n) => n * n)
  .reduce((sum, n) => sum + n, 0);

console.log(result);`,
  },
  {
    id: "js-004",
    language: "javascript",
    difficulty: "medium",
    title: "디스트럭처링과 스프레드",
    code: `const user = { name: "Alice", age: 30, role: "admin" };
const { name, ...rest } = user;

const updated = { ...rest, name: "Bob", active: true };
console.log(updated);`,
  },
  {
    id: "js-005",
    language: "javascript",
    difficulty: "hard",
    title: "Promise와 async/await",
    code: `const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(\`Fetch failed: \${error.message}\`);
    return null;
  }
};

const main = async () => {
  const urls = ["/api/users", "/api/posts"];
  const results = await Promise.all(urls.map(fetchData));
  console.log(results);
};`,
  },
  {
    id: "js-006",
    language: "javascript",
    difficulty: "hard",
    title: "클로저와 팩토리 패턴",
    code: `function createCounter(initial = 0) {
  let count = initial;

  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => { count = initial; return count; },
    getCount: () => count,
    toString: () => \`Counter(\${count})\`,
  };
}

const counter = createCounter(10);
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.toString());`,
  },

  // ===== TypeScript =====
  {
    id: "ts-001",
    language: "typescript",
    difficulty: "easy",
    title: "타입 어노테이션",
    code: `const greeting: string = "Hello, TypeScript!";
const count: number = 42;
const active: boolean = true;

console.log(greeting, count, active);`,
  },
  {
    id: "ts-002",
    language: "typescript",
    difficulty: "medium",
    title: "인터페이스와 제네릭",
    code: `interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

function parseResponse<T>(raw: string): ApiResponse<T> {
  return JSON.parse(raw) as ApiResponse<T>;
}

const res = parseResponse<User[]>('{}');
console.log(res.data);`,
  },
  {
    id: "ts-003",
    language: "typescript",
    difficulty: "hard",
    title: "유틸리티 타입과 가드",
    code: `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rect":
      return shape.width * shape.height;
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}

type ReadonlyShape = Readonly<Shape>;
type PartialUser = Partial<{ name: string; age: number }>;
console.log(area({ kind: "circle", radius: 5 }));`,
  },

  // ===== Java =====
  {
    id: "java-001",
    language: "java",
    difficulty: "easy",
    title: "Hello World",
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },
  {
    id: "java-002",
    language: "java",
    difficulty: "medium",
    title: "ArrayList와 Stream",
    code: `import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");

        List<String> filtered = names.stream()
            .filter(n -> n.length() > 3)
            .map(String::toUpperCase)
            .collect(Collectors.toList());

        filtered.forEach(System.out::println);
    }
}`,
  },
  {
    id: "java-003",
    language: "java",
    difficulty: "hard",
    title: "제네릭 클래스와 인터페이스",
    code: `public class Pair<K, V> implements Comparable<Pair<K, V>> {
    private final K key;
    private final V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() { return key; }
    public V getValue() { return value; }

    @Override
    public int compareTo(Pair<K, V> other) {
        return this.toString().compareTo(other.toString());
    }

    @Override
    public String toString() {
        return String.format("Pair(%s, %s)", key, value);
    }
}`,
  },

  // ===== Go =====
  {
    id: "go-001",
    language: "go",
    difficulty: "easy",
    title: "Hello World",
    code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
  },
  {
    id: "go-002",
    language: "go",
    difficulty: "medium",
    title: "구조체와 메서드",
    code: `package main

import "fmt"

type Rectangle struct {
    Width  float64
    Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}

func main() {
    rect := Rectangle{Width: 10.0, Height: 5.0}
    fmt.Printf("Area: %.2f\\n", rect.Area())
    fmt.Printf("Perimeter: %.2f\\n", rect.Perimeter())
}`,
  },

  // ===== Rust =====
  {
    id: "rs-001",
    language: "rust",
    difficulty: "medium",
    title: "소유권과 구조체",
    code: `struct Point {
    x: f64,
    y: f64,
}

impl Point {
    fn new(x: f64, y: f64) -> Self {
        Point { x, y }
    }

    fn distance(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2)
            + (self.y - other.y).powi(2))
        .sqrt()
    }
}

fn main() {
    let p1 = Point::new(0.0, 0.0);
    let p2 = Point::new(3.0, 4.0);
    println!("Distance: {:.2}", p1.distance(&p2));
}`,
  },
  {
    id: "rs-002",
    language: "rust",
    difficulty: "hard",
    title: "enum과 패턴 매칭",
    code: `#[derive(Debug)]
enum Command {
    Quit,
    Echo(String),
    Move { x: i32, y: i32 },
    Color(u8, u8, u8),
}

fn process(cmd: &Command) {
    match cmd {
        Command::Quit => println!("Quitting..."),
        Command::Echo(msg) => println!("Echo: {}", msg),
        Command::Move { x, y } => {
            println!("Moving to ({}, {})", x, y);
        }
        Command::Color(r, g, b) => {
            println!("Color: #{:02x}{:02x}{:02x}", r, g, b);
        }
    }
}

fn main() {
    let cmds = vec![
        Command::Echo(String::from("hello")),
        Command::Move { x: 10, y: 20 },
        Command::Color(255, 128, 0),
        Command::Quit,
    ];
    for cmd in &cmds {
        process(cmd);
    }
}`,
  },

  // ===== SQL =====
  {
    id: "sql-001",
    language: "sql",
    difficulty: "easy",
    title: "SELECT 기본",
    code: `SELECT id, name, email
FROM users
WHERE active = true
ORDER BY name ASC
LIMIT 10;`,
  },
  {
    id: "sql-002",
    language: "sql",
    difficulty: "medium",
    title: "JOIN과 집계",
    code: `SELECT
    d.name AS department,
    COUNT(e.id) AS employee_count,
    AVG(e.salary) AS avg_salary,
    MAX(e.salary) AS max_salary
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
WHERE e.hire_date >= '2024-01-01'
GROUP BY d.name
HAVING COUNT(e.id) >= 5
ORDER BY avg_salary DESC;`,
  },

  // ===== CSS =====
  {
    id: "css-001",
    language: "css",
    difficulty: "easy",
    title: "Flexbox 센터링",
    code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1a1a2e;
}`,
  },
  {
    id: "css-002",
    language: "css",
    difficulty: "medium",
    title: "Grid 레이아웃과 미디어 쿼리",
    code: `.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.card {
  border-radius: 0.75rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-4px);
}

@media (max-width: 768px) {
  .grid-layout {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}`,
  },
];

export default snippets;

// ===== 유틸 함수들 =====

export const LANGUAGES = [
  { id: "all", label: "전체", icon: "🌐" },
  { id: "python", label: "Python", icon: "🐍" },
  { id: "javascript", label: "JavaScript", icon: "💛" },
  { id: "typescript", label: "TypeScript", icon: "💙" },
  { id: "java", label: "Java", icon: "☕" },
  { id: "go", label: "Go", icon: "🐹" },
  { id: "rust", label: "Rust", icon: "🦀" },
  { id: "sql", label: "SQL", icon: "🗃️" },
  { id: "css", label: "CSS", icon: "🎨" },
];

export const DIFFICULTIES = [
  { id: "all", label: "전체", color: "text-gray-400" },
  { id: "easy", label: "초급", color: "text-green-400" },
  { id: "medium", label: "중급", color: "text-yellow-400" },
  { id: "hard", label: "고급", color: "text-red-400" },
];

export function getFilteredSnippets(language = "all", difficulty = "all") {
  return snippets.filter((s) => {
    const langMatch = language === "all" || s.language === language;
    const diffMatch = difficulty === "all" || s.difficulty === difficulty;
    return langMatch && diffMatch;
  });
}

export function getRandomSnippet(language = "all", difficulty = "all") {
  const filtered = getFilteredSnippets(language, difficulty);
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getMonacoLanguage(language) {
  const map = {
    python: "python",
    javascript: "javascript",
    typescript: "typescript",
    java: "java",
    go: "go",
    rust: "rust",
    sql: "sql",
    css: "css",
  };
  return map[language] || "plaintext";
}
