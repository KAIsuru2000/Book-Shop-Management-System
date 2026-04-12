git reset
git add src/main/java/lk/brightbs/loyaltycustomer/ src/main/resources/static/jsFiles/loyaltycustomer.js src/main/resources/templates/loyaltycustomer.html
git commit -m "feat: Implement Loyalty Customer Module"

git add src/main/java/lk/brightbs/seasonalDiscount/ src/main/resources/static/jsFiles/seasonalDiscount.js src/main/resources/templates/seasonalDiscount.html
git commit -m "feat: Implement Seasonal Discount Module"

git add src/main/java/lk/brightbs/inventory/ src/main/resources/static/jsFiles/inventory.js src/main/resources/templates/inventory.html
git commit -m "feat: Implement Inventory Management Module"

git add src/main/resources/static/jsFiles/priceRequest.js src/main/resources/resources/templates/priceRequest.html src/main/resources/static/jsFiles/addPriceList.js src/main/resources/templates/addPriceList.html
git commit -m "feat: Dynamic item filtering by supplier in Price Request and Add Price List"

git add src/main/resources/static/jsFiles/purchaseOrders.js src/main/resources/templates/purchaseOrders.html
git commit -m "feat: Update Purchase Order UI and item population logic"

git add src/main/resources/static/jsFiles/item.js src/main/java/lk/brightbs/item/controller/ItemController.java src/main/java/lk/brightbs/item/dao/ItemDao.java
git commit -m "fix: Resolve item status display issue and improve item data handling"

git add src/main/resources/templates/dashboard.html "src/main/resources/static/image/quick payment icon.png" src/main/java/lk/brightbs/login/controller/LoginController.java
git commit -m "design: Enhance Dashboard visual layout and icons"

git add src/main/java/lk/brightbs/BrightbsApplication.java src/main/java/lk/brightbs/configuration/WebConfiguration.java src/main/java/lk/brightbs/employee/dao/EmployeeDao.java src/main/java/lk/brightbs/privilege/controller/UserPrivilegeController.java src/main/java/lk/brightbs/service/MyUserServiceDetail.java src/main/resources/application.properties src/main/resources/static/jsFiles/employee.js src/main/resources/templates/fragment.html
git commit -m "refactor: Update core configurations, user privileges, and layout fragments"
