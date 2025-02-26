


def hex2rgb(hx_int: int | str) -> tuple[int, int, int]:
    if isinstance(hx_int, str):
        if hx_int[0] == "#":
            hx_int = int(hx_int[1:], 16)
        else:
            hx_int = int(hx_int, 16)
        
    r, g, b = (hx_int >> 16) & 0xff, (hx_int >> 8) & 0xff, hx_int & 0xff

    return r, g, b

def learn_loop():
    # 1: just loop
    nums = [1, 2, 3, 4, 5]
    for num in nums:
        print(num, end=", ")
    print()
    
    # loop with index
    for i, num in enumerate(nums):
        print(f"nums[{i}] = {num}", end="")
        if i != len(nums) - 1:
            print(", ")
        else:
            print()

    names = ['Joyce', 'Hannah', 'Manny', 'Manoj', 'Ezekiel']
    print("_______________pass______________")
    for name in names:
        if 'j' in name.lower():
            print(f"{name} has 'j' in it.")
            pass
        else:
            print(name)
    
    print("______________continue______________")
    for name in names:
        if 'h' in name.lower():
            print(f"{name} has 'h' in it.")
            continue
        
        print(name)

    print("_______________break______________")
    for name in names:
        if 'a' in name.lower():
            print(f"{name} has 'a' in it.")
            break

        print(name)

def learn_try_catch_finally():
    nums = [0, 1, 2, 3]
    try:
        print(sum(nums))
    except:
        print("cannot sum non-number elements!")
    finally:
        print('I always show up')

def learn_lambda():
    nums = [1, 2, 3, 4, 5, 6]
    odd_nums = list(filter(lambda x: x % 2 == 1, nums))
    odd_nums = filter(lambda x: x % 2 == 1, nums)
    print(type(odd_nums))
    print(list(odd_nums))

class LearnInitDel():
    def __init__(self, param1):
        self.param1 = param1
    def __del__(self):
        print("learn_init_del is deleted")

def test_learn_init_del():
    obj1 = LearnInitDel("a parameter")
    del obj1

class LearnAccessModifier():
    def __init__(self, pub_param, protected_param, private_param):
        self.pub_param = pub_param # public access
        self._protected_param = protected_param # subclass access
        self.__private_param = private_param # only accessed by this class

    def print_params(self):
        print(f"public: {self.pub_param},\
protected: {self._protected_param},\
private: {self.__private_param}")

def test_access_modifiers():
    obj = LearnAccessModifier("pub_param", "_protected_param", "__private_param")
    obj.print_params()

class Person:
    def __init__(self, name):
        self.name = name
    
    def print_info(self):
        print(f"The name: {self.name}")

class Teacher(Person):
    def __init__(self, name, subject):
        self.subject = subject
        super().__init__(name)

def test_inheritance():
    teacher = Teacher("Jack", "Math")
    teacher.print_info()

class Animal:
    def __init__(self, name):
        self.name = name
    
    def print_info(self):
        print(f"The name: {self.name}")

# Somewhat like duck type, i.e., classes sharing same methods
def test_polymorphism():
    p = Person("Jack")
    a = Animal("dog")
    for o in (p, a):
        o.print_info()

def learn_built_in():
    intro = "My name is Jeff!"
    print(intro.lower()) # prints 'my name is jeff!'
    print(intro.upper()) # prints 'MY NAME IS JEFF!'
    print(intro.title()) # prints 'My Name Is Jeff!'

    print(intro.split()) # prints ['My', 'name', 'is', 'Jeff!']
    print(intro.split('name')) # prints ['My ', ' is Jeff!']
    print(intro.split('!')) # prints ['My name is Jeff', '']

def learn_list_tuple():
    my_tuple = ('abc', 123, 'def', 456, 789, 'ghi')

    len(my_tuple) # returns length of tuple
    # my_tuple) # throws error cuz of mixed types
    # my_tuple.index(123) # throws error cuz of mixed types
    my_tuple.count('abc') # returns the number of occurrences of the value 'abc'

def learn_set():
    students = {'Jane', 'Carlos', 'Amy', 'Bridgette', 'Chau', 'Dmitry'}
    students.remove('Bridgette')
    print(students)

from node import Node

class Queue:
  def __init__(self):
    self.head = None
    self.tail = None
    self.size = 0
  
  def enqueue(self, value):

    item_to_add = Node(value)
    print("Adding " + str(item_to_add.get_value()) + " to the queue!")
    if self.is_empty():
      self.head = item_to_add
      self.tail = item_to_add
      self.size = 1
    else:
      self.tail.set_next_node(item_to_add)
      self.tail = item_to_add
      self.size += 1
       
  def dequeue(self):
    if self.get_size() > 0:
      item_to_remove = self.head
      print(str(item_to_remove.get_value()) + " is served!")
      if self.get_size() == 1:
        self.head = None
        self.tail = None
      else:
        self.head = self.head.get_next_node()
        self.size -= 1
        return item_to_remove.get_value()
    else:
      print("The queue is totally empty!")


  def peek(self):
    if self.size > 0:
      return self.head.get_value()
    else:
      print("No orders waiting!")
     
  def get_size(self):
    return self.size
  
  def is_empty(self):
    return self.size == 0

def main():
    # print(hex2rgb("#fa1f9e"))
    # learn_loop()
    # learn_try_catch_finally()
    # learn_lambda()
    # test_learn_init_del()
    # test_access_modifiers()
    # test_inheritance()
    # test_polymorphism()
    # learn_built_in()
    # learn_list_tuple()
    learn_set()
    
    

if __name__ == '__main__':
    main()