import Markdown from "../../components/markdown";
import { Globe, Mail, Github, Linkedin } from "lucide-react";

const content = `
## Разработка программно-аппаратных решений с использованием **ESP32**,  **STM32** и их аналогов 
для реализации в составе встраиваемых систем, промышленных контроллеров, IoT-устройств и интеллектуальных систем управления.  

### Ключевые направления:  
- **Разработка прошивок для ESP32 и STM32** – **ESP-IDF, FreeRTOS, HAL/LL STM32**, CMSIS.  
- **Интернет вещей (IoT)** – интеграция с **MQTT, HTTP(S), WebSockets, Modbus, CAN** и другими протоколами.  
- **Автоматизация и управление** – реализация алгоритмов ПИД-регулирования, цифровой фильтрации и анализа данных.  
- **Разработка периферийных интерфейсов** – работа с **SPI, I2C, UART, RS-485, CAN, Ethernet, USB**.  
`;

export default async function Page() {
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">About</h1>
        <Markdown content={content} />
      </div>
    </>
  );
}
