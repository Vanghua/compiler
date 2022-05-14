# 词法分析器项目结构以及模块功能说明

### 1.数据结构文件夹中 Token.js

数据结构文件夹中包含Token.js，提供Token类。Token类是一个封装好的描述词素的类，由于JavaScript是动态语言，对类型的限制较为松散，因此在封装Token类时加入了对象代理来进行类型检查，实现一个类似c++的严格的类。

* Token类的描述（只展示字段，其它方法和对象代理省略）

  ```javascript
  class Token {
      row	// 词素在文件中的行号
      col // 词素首字符在文件中的列号
      type // 词素种别码
      content // 词素内容
      constructor() {
          this.content = ""
          this.type = -1
          this.row = -1
          this.col = -1
      }
  }
  ```

  



### 2.待编译文件夹中 analysis.c 和 analysis.txt

待编译文件夹中放置了两种类型的待编译文件，analysis.txt是用于某几种词素的测法分析测试，analysis.c是用于C语言文件的词法分析测试。



### 3.read.js

read.js模块提供了文件读能力。

* 暴露open和read两个函数，其中open函数接收一个文件名，返回文件描述符；read函数接收文件描述符，读取文件，返回字符数组。要注意的是open和read两者都是异步函数。

* read函数使用缓冲区读文件，由于C语言允许的最大标识符长度是32，因此缓冲区大小为32字节。在读取完毕后，将会把缓冲区每个字节都转化为Unicode下的utf8编码格式。其中要注意的是，utf8下英文，数字，大部分常见特殊字符都是1个字节，因此转化后，缓冲区每个字节对应一个英文字母，数字或特殊字符。在utf8下汉子占3个字节，因此使用该策略会导致汉字乱码，不过C语言不允许汉字成为标识符，汉字可以成为注释。因此汉字乱码不会影响标识符判断。特别说明，如果不使用该策略，而是让每三个字节尽可能成为一个汉字，即调用函数toString()，后果是32字节的缓冲区内容将会被转化成不到32长度的字符数组，这会影响词法分析器的正常运行，特别是在注释的识别上可能产生错误，因为词法分析器接收32长度的字符数组并把它当做缓冲区。

* read.js模块使用说明：

  ```javascript
  let { open, read } = require("./read.js")
  
  open("analysis.c")
      .then(fd => read(fd))
      .then(cString => {
      	console.log(cString)
  	})
  ```

  

### 4.词法分析器测试文件夹中 write.js 和 result.txt

write.js模块提供了文件写能力。

* 暴露init和work两个函数，其中init函数接收一个文件标识符fd，初始化模块内部的全局变量fd；work函数是异步函数，不接收参数，将自动根据模块内的全局变量fd将接收到的词集写入result.txt中，使用缓冲区写。

* write.js模块使用说明：

  ```javascript
  let { init, work } = require("./write.js")
  let { open } = require("./read.js")
  
  open("./analysis.c")
      .then(fd => init(fd))
      .then(() => work())
  ```

  

### 5.type.js

type.js提供了本项目规定的C语言种别码以及按字典序排序的C语言关键字

* C语言种别码可以看做一个映射，虽然代码中并没有声明map对象。种别码表中的每个元素都是一个长度为2的数组，第一个元素是符号，第二个元素是它的种别码，是一个正整数，该数组在种别码表中的下标与种别码相同。如果想在知道字符类型时可以快速知道其种别码，可以根据该表直接声明map即可，这一点暂时没有用到，考虑到未来可能的需求，因此保留该形式。

* 另外在词素Token对象中存储时，存储种别码而不是字符类型。因此可以通过种别码直接在种别码表中查询到当前词素是哪一种字符。

* type.js模块使用说明

  ```javascript
  let { reserveWords, type } = require("./type.js")
  // reserveWords是保留字表，是一个数组。type是种别码表，是一个二维数组。
  ```

  

### 6.getTable.js

utils.js提供了本项目中词法分析部分的常用工具函数，为了让词法分析部分代码更加清晰，因此将一些函数抽离出来封装到工具模块中。

* throwAnalysisError：词法分析错误处理函数
* throwError： 运行时错误处理函数
* judAlphabet：判断一个字符是否是字母
* judNumber：判断一个字符是否是数字
* jud_：判断一个字符是否是下划线
* judBlank：判断一个字符是否是空格
* judEnter：判断一个字符是否是回车
* judNewLine：判断一个字符是否是换行符
* judTab：判断一个字符是否是水平制表符
* judAllAlphabet：判断一个字符串是否全部由字母组成
* judReserve：采用折半查找判断一个字符串是否是保留字
* judIdentifierOrReserve：判断一个字符串是保留字或标识符
* judPoint：判断一个字符是否是小数中的小数点
* jud0x：判断一个字符是否是16进制数开头的0x中的x或X
* jud0b：判断一个字符是否是8进制数开头的0b中的b或B
* jud0xNum：判断一个字符是否属于16进制数范围内的字符
* jud0bNum：判断一个字符是否属于8进制数范围内的字符
* selectState：在DFA初始状态下根据输入的字符选择下个状态



### 7.analysis.js

analysis.js提供了词法分析器功能

* analysis.js模块暴露两个函数，init和work，init是模块初始化函数，接收两个参数fd和rd，表示文件标识符和read.js模块中的read函数，调用init后会初始化模块中的全局变量。work函数是一个异步函数，表示词法分析器开始工作。

  ```javascript
  let { open, read } = require("./read.js")
  let { init, work } = require("./analysis.js")
  
  open("./analysis.c")
      .then(fd => init(fd, read)) // 词法分析器模块初始化
      .then(() => work()) // 调用词法分析功能
      .then(() => console.log("词法分析成功"))
  ```

* **模块内部函数nextChar：** nextChar不接收参数，nextChar根据词素尾指针的位置，返回前缓冲区指定位置的字符。在返回时将调用updateRowCol函数更新记录当前字符在源文件中的行列信息。如果词素尾指针越过了当前缓冲区，那么调用reRead函数，将后续内容读入空闲缓冲区，并将词素尾指针置为新缓冲区的首字符位置。

* **模块内部函数getToken：** getToken接收一个参数，该参数表示词素的种别码。getToken函数将会根据词素首尾指针的位置计算出词素的内容，其中考虑两种情况，首尾指针在同一个缓冲区和首尾指针不在同一个缓冲区。getToken函数将会根据当前记录的行列信息计算出词素的首字符所在的行和列。综上信息getToken函数将会生成一个token并加入tokens词素集中。

* **模块内部函数reRead：** reRead不接收参数，reRead将查看当前使用的缓冲区，并调用read.js模块的read函数再读入32字节的内容，将内容存入空闲缓冲区，之后置后词素尾指针为新缓冲区首字符位置。之后设置新缓冲区为当前缓冲区。

* **模块内部函数retract：** retract接收两个参数，一个是当前字符，一个是词素种别码。retract函数会在到达DFA某个接收状态时调用，并且该接收状态是多读了一个字符后到达的（该部分请参考上课的ppt）。retract会将词素尾指针减一，记录的列数减一，因为多读了一个字符；retract会将DFA状态置为初态；retract会调用getToken函数生成词素；retract会将词素首指针置为词素尾指针位置；retract会将词素首指针所在缓冲区设置为尾指针所在缓冲区。

* **模块内部函数back：** back不接收参数。back函数会在到达DFA某个接收状态时调用，并且该接收状态是没有多读字符时到达的。此时除了尾指针和列数减一操作，其余操作与retract函数相同。

* **模块内部函数noTokenBack：** noTokenBack不接收参数。noTokenBack会在到达DFA某个接收状态时调用，并且该接收状态时没有多读字符时到达的，并且该状态下不需要生成词素，例如注释。noTokenBack除了不会调用getToken函数，其余操作和back函数相同。

* **模块内部函数updateRowCol：** updateRowCol函数接收一个参数，该参数表示当前读取的字符。如果当前字符时换行符，那么行数加1，列数置为0。否则列数加1。

* **模块内部函数work：** work函数不接收参数，work函数是核心函数。从初始状态出发，执行死循环，尝试从读到的字符进入指定状态，并执行制定操作。如果读到eof那么将会退出循环。如果读到不在种别码表范围内的字符则抛出错误。



### 8.main.js

main.js为核心控制模块，也是词法分析器入口模块。

main.js执行流程是，打开待编译文件，把该文件标识符和读文件函数用来初始化词法分析器模块。之后调用词法分析器模块，暴露出词素集，以便后续操作。