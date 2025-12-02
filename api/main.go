package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

// Device 结构体对应数据库中的 devices 表
type Device struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	IPAddress string `json:"ip_address"`
	Status    string `json:"status"`
}

var db *sql.DB

func main() {
	// 格式: 用户名:密码@tcp(地址:端口)/数据库名
	dsn := "t8000_user:t8000_password@tcp(127.0.0.1:3306)/t8000_db"

	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("打开数据库失败: ", err)
	}
	defer db.Close()

	// 2. 测试连接
	err = db.Ping()
	if err != nil {
		log.Fatal("连接数据库失败 (请确保MySQL已运行且已执行init.sql): ", err)
	}
	log.Println("成功连接到 MySQL 数据库!")

	// 3. 设置路由
	http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message":"hello from go"}`))
	})

	// 新增: 获取设备列表的 API
	http.HandleFunc("/api/devices", getDevices)

	log.Println("Server starting on :8080...")
	http.ListenAndServe(":8080", nil)
}

func getDevices(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 查询数据库
	rows, err := db.Query("SELECT id, name, ip_address, status FROM devices")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var devices []Device
	for rows.Next() {
		var d Device
		if err := rows.Scan(&d.ID, &d.Name, &d.IPAddress, &d.Status); err != nil {
			log.Println(err)
			continue
		}
		devices = append(devices, d)
	}

	json.NewEncoder(w).Encode(devices)
}
