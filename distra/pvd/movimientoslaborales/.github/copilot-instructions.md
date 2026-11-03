# Copilot Instructions for Movimientoslaborales

## Overview
The `movimientoslaborales` project is a PHP-based application built on the Zend Framework. It manages labor movements, including historical data, filtering, and reporting. The project is structured into controllers, models, and views, with a focus on modularity and reusability.

## Architecture
- **Controllers**: Located in `apps/controllers/`, controllers handle HTTP requests and coordinate between models and views. Example: `MovimientopersonaController.php`.
- **Models**: Found in `apps/models/`, models encapsulate business logic and database interactions. Example: `DatSituacionlaboralModel.php`.
- **Views**: Stored in `web/views/`, views manage the frontend, including JavaScript and ExtJS components. Example: `movimientopersona.view.js`.
- **SQL Scripts**: Located in `sql/`, these scripts manage database schema and migrations.

## Key Patterns and Conventions
1. **Zend Framework**:
   - Controllers extend `ZendExt_Controller_Secure`.
   - Models extend `ZendExt_Model`.
2. **Date Handling**:
   - Dates are formatted as `d/m/Y`.
   - Filtering by date ranges is common in historical data views.
3. **Error Handling**:
   - Use `ZendExt_Exception` for controlled exceptions.
   - Log errors using `error_log()`.
4. **Frontend Integration**:
   - ExtJS is used for grids, forms, and filtering.
   - Filters are passed to the backend as HTTP parameters.

## Developer Workflows
### Building and Testing
- **Build**: No explicit build process; ensure PHP and Zend Framework are correctly configured.
- **Testing**: Manual testing via the browser. Ensure the server is running and accessible.

### Debugging
- Use `error_log()` for debugging PHP code.
- Check the browser console for JavaScript errors.

## Integration Points
- **Database**: SQL scripts in `sql/` define the schema. Models interact with the database using Zend Framework's ORM.
- **Frontend**: JavaScript files in `web/views/js/` handle user interactions and communicate with controllers.

## Examples
### Filtering Historical Data by Date
In `DatSituacionlaboralModel.php`:
```php
if (!empty($fibaja) && !empty($ffbaja)) {
    $query->andWhere('fdesde >= ?', $fibaja);
    $query->andWhere('fhasta <= ?', $ffbaja);
}
```

### Adding a New Controller Action
In `MovimientopersonaController.php`:
```php
public function newAction() {
    $data = $this->_getParam('data');
    $result = $this->_objSitLabModel->processData($data);
    echo json_encode($result);
}
```

## Key Files and Directories
- `apps/controllers/`: Contains all controllers.
- `apps/models/`: Contains all models.
- `web/views/`: Contains frontend files.
- `sql/`: Contains SQL scripts for database management.

## Notes
- Ensure PHP version is compatible with the codebase (PHP 7.0 or higher recommended).
- Follow the existing patterns for consistency.
