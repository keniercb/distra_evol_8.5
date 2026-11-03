<?php

/**
 * Created by PhpStorm.
 * User: raciel
 * Date: 17/07/14
 * Time: 9:57
 */
class templateModel
{

    /**
     * @var Doctrine_Record
     */
    private $model;

    public function __construct($agModel)
    {
        $this->model = $agModel;
    }

    /**
     * Devuelve un arreglo con las columnas que se introducen
     * determinando si son validas y si son NOT NULL
     *
     * @param $agParaams
     *
     * @return array
     */
    private function validateColumsNames($agParams)
    {
        // Arreglo devolucion e las columnas validadas con sus valores
        $arrayColums = array();
        // Obtener las colmnas de la tabla con sus atributos y opciones
        $columns = $this->getTable()->getColumns();
        // Activar las validaciones
        $manager = Doctrine_Manager::getInstance();
        $manager->setAttribute(
            Doctrine_Core::ATTR_VALIDATE, Doctrine_Core::VALIDATE_ALL
        );
        // Para cada columna de la tabla
        foreach ($columns as $fieldName => $column) {
            // Verificar si se encuentra y Tomar el valor
            $value = (isset($agParams[$fieldName])) ? $agParams[$fieldName]
                : null;

            $dic = $this->getTable()->validateField($fieldName, $value);
//            print($fieldName.'/');
//            print_r($column);print('/');
//            print_r($dic);
            // Verificar si el error es de lull y la tabla presenta una secuencia
            if ($dic->count() > 0) {
                // Si presenta secuencia verificar para eliminar el tipo de error notnull
                if (isset($column['sequence'])) {
                    $errors = $dic->get($fieldName);
                    if ($errors != null) {
                        $aux = array();

                        foreach ($errors as $k => $r) {
                            $aux[$r] = $k;
                        }

                        if (isset($aux['notnull']) && !isset($errors[1])) {
                            $dic->clear();
                        }
                    }
                }
            }

            $arrayColums[$fieldName] = array('field' => $fieldName,
                                             'value' => $value,
                                             'type' => $column['type'],
                                             'error' => $dic);
        }
        // Desactivar validaciones
        $manager->unsetAttribute(Doctrine_Core::ATTR_VALIDATE);
        return $arrayColums;
    }

    /**
     * Devuelve las tablas de doctrine
     *
     * @return Doctrine_Table
     */
    public function getTable()
    {
        return $this->model->getTable();
    }

    /**
     * Funcion para devolver las columnas
     *
     * @return array
     */
    public function getColumns()
    {
        $table = $this->getTable();
        return $table->getColumns();
    }

    /**
     * Devuelve arreglo de campos identificadores
     *
     * @return array
     */
    public function getKeyColumnsNames()
    {
        $table = $this->getTable();
        return $table->getIdentifierColumnNames();
    }

    /**
     * Funcion paraa obtener el nombre de la tabla
     */
    public function getModelName()
    {
        return get_class($this->model);
    }

    /**
     * Devuelve las relaciones que posee la tabla
     *
     * @return array(Doctrine_Relation)
     */
    public function getRelations()
    {
        return $this->getTable()->getRelations();
    }

    /**
     * Funcion para devolver las columnas
     */
    public function getData(
        $agStart, $agLimit, $agOrder = false, $agOrderDirect,
        $agFiltre = null, $join = 1
    ) {
        try {
            $relations = array();
            $agOrderDirect = !$agOrderDirect ? 'DESC' : $agOrderDirect;
            $result = HelperModel::excecute(
                $this->model, 'getModelData', array($agStart, $agLimit, $agOrder, $agOrderDirect, $agFiltre)
            );

            if ($result == null) {
                if ($join) {
                    $relations = $this->getRelations();
                }
                $modelName = $this->getModelName();
                $columsId = $this->getKeyColumnsNames();
                $strIdentifiesColumns = implode(', a.', $columsId);
                $columns = $this->getTable()->getColumnNames();
                $strIColumns = implode(', a.', $columns);

                // Verificar el orden de los datos
                if (!$agOrder) {
                    $agOrder = $strIdentifiesColumns;
                }

                // Busar los elementos definidos dentro del inicio y limite ordenados
                $q = new Doctrine_Query();
                $res = $q->select('a.' . $strIColumns)->from($modelName . ' a ')
                    ->orderby($agOrder . ' ' . $agOrderDirect)->offset($agStart)
                    ->limit($agLimit)->innerJoin('');
                // Trabajar en las uniones
                $countRelations = 0;
                $alias = array();

                foreach ($relations as $relation) {
                    if ($relation->getType() === 0) {
                        $relationId = 'b' . $countRelations++;
                        $tableRelation = $relation->getTable();
                        $columnsrelation = $tableRelation->getColumnNames();
                        $res = $res->addSelect($relationId . '.' . implode(', ' . $relationId . '.', $columnsrelation))
                            ->leftJoin(' a.' . $relation->getAlias() . ' ' . $relationId);
                        $alias  [$relation->getAlias()] = $relationId;
                    }
                }

                // Verificar el trabajo de los filtros
                if (isset($agFiltre) && $agFiltre != '' && is_array($agFiltre)) {
                    $like = '';
                    foreach ($agFiltre as $value) {
                        if ($like != '') {
                            $like .= ' AND ';
                        }

                        // Si el tipo de dato es booleano reformatearlo a 0 o 1
                        $type = $value['data']['type'];
                        if ($type === 'boolean') {
                            $value['data']['value'] = $value['data']['value'] == 'true' ? 1 : 0;
                        }
                        // reformatear con el alias
                        $elements = explode('.', $value['field']);
                        $alia = '';
                        if (isset($alias[$elements[0]])) {
                            $alia = $alias[$elements[0]] . '.';
                            array_shift($elements);
                        }

                        //Definiendo operador ha utilizar en la condicion
                        $comparison = $value['data']['comparison'];
                        $operator = " = ";
                        if ($comparison) {
                            if ($comparison === 'lt') {
                                $operator = " < ";
                            } else {
                                if ($comparison === 'gt') {
                                    $operator = " > ";
                                }
                            }
                        }

                        $valueField = $alia . implode('.', $elements);
                        if ($type === 'numeric') {
                            $like .= $valueField . "" . $operator . "" . $value['data']['value'];
                        } else {
                            if ($type === 'date') {
                                list($moth, $day, $year) = explode('/', $value['data']['value']);
                                $like .= $valueField . "" . $operator . "'$day/$moth/$year'";
                            }elseif($type === 'boolean'){
                                $like .= $valueField . " = " . $value['data']['value'];
                            } else {
                                $like .= $valueField . " ILIKE '%" . $value['data']['value'] . "%'";
                            }
                        }
                    }
                    // Si se creo el filtro agregarlo a la restriccion de datos y al contador
                    if ($like != '') {
                        $res = $res->addWhere($like);
                    }
                }
//                print($res->getSqlQuery());die;
                $final = $res->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
                return array('cant' => $res->count(), 'data' => $final);
            } else {
                return $result;
            }
        } catch (Doctrine_Exception $exception) {
            throw $exception;
            //return array('cant' => 0, 'data' => ($exception->getMessage()));
        }

    }

    /**
     * Inserra los valores
     *
     * @param $agParams
     *
     * @return array
     */
    public function insertValues($agParams)
    {

        $action = 'Insert';
        // Verificar para ejecutar las precondiciones si el Modelo posee
        $preInsert = HelperModel::excecute(
            $this->model, 'pre' . $action . 'Values', $agParams
        );

        /**
         * null : No se hace nada
         * false: Se detenien la ejecucion y se devuelve un error
         * array: se combina con el arreglo de parametros
         */
        if ($preInsert !== null) {
            if (is_array($preInsert)) {
                $agParams = array_merge($agParams, $preInsert);
            } elseif ($preInsert === false) {
                // buscar el manejador de errores para el modelo
                $msError = HelperModel::excecute(
                    $this->model, 'getLastError', $agParams
                );
                if ($msError !== null && $msError !== false) {
                    return array('success' => false, 'msg' => $msError);
                }
                return array('success' => false,
                             'msg'     => 'Ocurri&oacute; un error.');
            }
        }

        // relacionar las columnas de la tabla con los parametros enviados
        $columns = $this->validateColumsNames($agParams);
//        print_r($agParams);
//        print_r($columns);die;

        // Tomar el valor del modelo
        $model = $this->model;
        // Para cada columna con su valo y validacion
        foreach ($columns as $column) {
            $fieldName = $column['field'];
            $value = $column['value'];
            if($column['type']=='string'){
                $value = str_ireplace('"','',$column['value']);
            }else if($column['type']=='float'){
                $value = str_replace(',', '.', $column['value']);
            }else{
                $value = $column['value'];
            }
            // Verificar si existe algun error
//            $errorHandler = $column['error'];
//            if ($errorHandler->count() > 0) {
//                //var_dump($errorHandler->count() > 0);die;
//                //print_r($column);die;
//                // TODO definir el mensaje de error correctamente segun el manejador de errores
//                return array('failure' => true,
//                             'msg'     => 'El campo "' . $fieldName
//                                 . '" contiene errores de validaci&oacute;n.');
//            }
            $model->{$fieldName} = $value;
        }

        // intentar salvar
        try {
//            print_r($model);die;
            $out = $model->save();

            $out = array('model' => $model, 'params' => $agParams);

            // Verificar para ejecutar las postcondiciones si el Modelo posee para la insersion
            HelperModel::excecute(
                $this->model, 'post' . $action . 'Values', $out
            );
        } catch (Doctrine_Exception $e) {
            // Verificar para ejecutar acciones por la ejecucion de excepciones
            $msError = HelperModel::excecute(
                $this->model, 'handleException' . $action, $e
            );
            if ($msError !== null && $msError !== false) {
                return array('success' => false, 'msg' => $msError);
            }

            return array('success'         => false, 'msg' =>
                'Ocurri&oacute; un error mientras se almacenaban los valores: '
                . $e->getMessage(), 'code' => $e->getCode());
        }
        return array('success'  => true,
                     'msg'      => 'El valor fue adicionado satisfactoriamente.',
                     'entities' => json_encode($out['model']->toArray())
        );
    }

    /**
     * Modifica los valores del modelo platilla
     *
     * @param $agParams
     *
     * @return array
     */
    public function modifyValues($agParams)
    {
        $action = 'Modify';
        // Verificar para ejecutar las precondiciones si el Modelo posee
        $preModify = HelperModel::excecute(
            $this->model, 'pre' . $action . 'Values', $agParams
        );

        /**
         * null : No se hace nada
         * false: Se detenien la ejecucion y se devuelve un error
         * array: se combina con el arreglo de parametros
         */
        if ($preModify !== null) {
            if (is_array($preModify)) {
                $agParams = array_merge($agParams, $preModify);
            } elseif ($preModify === false) {
                // buscar el manejador de errores para el modelo
                $msError = HelperModel::excecute(
                    $this->model, 'getLastError', $agParams
                );
                if ($msError !== null && $msError !== false) {
                    return array('success' => false, 'msg' => $msError);
                }
                return array('success' => false,
                             'msg'     => 'Ocurri&oacute; un error.');
            }
        }

        // relacionar las columnas de la tabla con los arametros enviados
        $columns = $this->validateColumsNames($agParams);
        // Tomar el valor del modelo
        $model = $this->model;
        $data = array();
        // Para cada columna con su valo y validacion
        foreach ($columns as $column) {
            $fieldName = $column['field'];
//            $value = $column['value'];
            if($column['type']=='string'){
                $value = str_ireplace('"','',$column['value']);
            }else if($column['type']=='float'){
                $value = str_replace(',', '.', $column['value']);
            }else{
                $value = $column['value'];
            }
            // Verificar si existe algun error
            $errorHandler = $column['error'];
            /*if ($errorHandler->count() > 0) {
                // TODO definir el mensaje de error correctamente segun el manejador de errores
                return array('failure' => true,
                             'msg'     => 'El campo "' . $fieldName
                                 . '" contiene errores de validaci&oacute;n.');
            }*/
            $model->{$fieldName} = $value;
            $data[$fieldName] = $value;
        }

        // intentar actualizar los valores
        try {
            // Reasignar los identificadores a la tabla
            $model->assignIdentifier(true);
            // Buscar los valores
            $modelModified = $model->getTable()->find($model->identifier());
            //En caso de que no exista
            if (empty($modelModified)) {
                return array('success' => true,
                             'msg'     => 'El elemento fue eliminado previamente.');
            }
            // Actualizar de los valores anteriores
            $modelModified->setArray($data);
            // Salvar los datos
            $modelModified->save();

            $out = array('model' => $modelModified, 'params' => $agParams);
            // Verificar para ejecutar las postcondiciones si el Modelo posee al modificar
            HelperModel::excecute(
                $this->model, 'post' . $action . 'Values', $out
            );

        } catch (Doctrine_Exception $e) {
            // Verificar para ejecutar acciones por la ejecucion de excepciones
            $msError = HelperModel::excecute(
                $this->model, 'handleException' . $action, $e
            );
            if ($msError !== null && $msError !== false) {
                return array('success' => false, 'msg' => $msError);
            }

            return array('success'         => false, 'msg' =>
                'Ocurri&oacute; un error mientras se almacenaban los valores: '
                . $e->getMessage(), 'code' => $e->getCode());
        }
        return array('success'  => true,
                     'msg'      => 'El valor fue modificado satisfactoriamente.',
                     'entities' => json_encode($out['model']->toArray())
        );
    }

    /**
     * Eliminar un elemento
     *
     * @param $agParams
     *
     * @return array
     */
    public function deleteValues($agParams)
    {
        $action = 'Delete';
        // Verificar para ejecutar las precondiciones si el Modelo posee
        $preDelete = HelperModel::excecute(
            $this->model, 'pre' . $action . 'Values', $agParams
        );

        /**
         * null : No se hace nada
         * false: Se detenien la ejecucion y se devuelve un error
         * array: se combina con el arreglo de parametros
         */
        if ($preDelete !== null) {
            if (is_array($preDelete)) {
                $agParams = array_merge($agParams, $preDelete);
            } elseif ($preDelete === false) {
                // buscar el manejador de errores para el modelo
                $msError = HelperModel::excecute(
                    $this->model, 'getLastError', $agParams
                );
                if ($msError !== null && $msError !== false) {
                    return array('success' => false, 'msg' => $msError);
                }
                return array('success' => false,
                             'msg'     => 'Ocurri&oacute; un error.');
            }
        }

        // Arreglo devolucion e las columnas validadas con sus valores
        $arrayColums = array();
        // Obtener las colmnas de la tabla con sus atributos y opciones
        $columns = $this->getKeyColumnsNames();
        // Obtener el modelo
        $model = $this->model;
        // Almacenar los datos en arreglo aosicativo
        $data = array();
        // Para cada columna de la tabla
        foreach ($columns as $fieldName) {
            // Verificar si se encuentra y Tomar el valor
            $value = (isset($agParams[$fieldName])) ? json_decode(
                $agParams[$fieldName]
            ) : null;
            if ($value != null) {
                $data[$fieldName] = $value;
            }
        }
        // Intentar eliminar los valores
        try {
            // Para cada valor enviado
            foreach ($data as $columnName => $values) {
                foreach ($values as $value) {
                    $modelModified = $this->deleteValue($columnName, $value);
                    $out = $modelModified != null ? true : false;
                    HelperModel::excecute(
                        $this->model, 'post' . $action . 'Values',
                        array('isOk' => $out, 'data' => $modelModified)
                    );
                }
            }

        } catch (Doctrine_Exception $e) {
            // Verificar para ejecutar acciones por la ejecucion de excepciones
            $msError = HelperModel::excecute(
                $this->model, 'handleException' . $action, $e
            );
            if ($msError !== null && $msError !== false) {
                return array('success' => false, 'msg' => $msError);
            }


            $msg = explode('DETAIL:', $e->getMessage());
            $msg = (count($msg) > 1) ? ($msg[1]) : ($e->getMessage());

            return array('success'          => false,
                         'msg'              =>
                             'Ocurri&oacute; un error mientras se eliminaban los valores: '
                             . $msg, 'code' => $e->getCode());
        }
        return array('success' => true,
                     'msg'     => 'El valor fue eliminado satisfactoriamente.');
    }

    /**
     * Funcion para elimnar un valor
     *
     * @param $agColumnName
     * @param $agId
     *
     * @return mixed|null
     */
    private function deleteValue($agColumnName, $agId)
    {
        try {

            // TODO validar que el campo sea llave y exista
            $this->model->{$agColumnName} = $agId;
            // Mapear el id
            $this->model->assignIdentifier(true);
            // Buscar los valores
            $modelModified = $this->model->getTable()->find(
                $this->model->identifier()
            );
            //En caso de que no exista
            if (empty($modelModified)) {
                return null;
            }
            // Actualizar de los valores anteriores
            $modelModified->delete();
            return $modelModified;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Eliminar un elemento
     *
     * @param $agParams
     *
     * @return array
     */
    public function digestConfig($config)
    {

        // Buscar las columnas

        //$relations = $this->getRelations();
        //$modelName = $this->getModelName();
        //$columsId = $this->getKeyColumnsNames();
        $columns = $this->getColumns();
        //$Identifier = $this->getIdentifier();
        $output = array();
        $count = 0;

        $relatonsTypes = array('numeric'           => 'int',
                               'string'            => 'string',
                               'character varying' => 'string',
                               'text'              => 'string',
                               'character'         => 'string',
                               'decimal'           => 'int',
                               'float'             => 'int', 'integer' => 'int',
                               'array'             => 'string',
                               'boolean'           => 'boolean',
                               'date'              => 'date',
                               'time'              => 'string',
                               'timestamp'         => 'int');

        // crear para cada columna
        foreach ($columns as $fieldname => $column) {

            /*$width = $column['length'] * 8;
            // Reajustar el tamano
            if ($width > 300) {
                $width = 300;
            }*/

            $dataType = isset($relatonsTypes[$column['type']])
                ? $relatonsTypes[$column['type']] : 'string';
            $length = $column['length'] == null ? 1 : $column['length'];

            $column['notnull'] = isset($column['notnull']) ? $column['notnull']
                : false; //add by mgleon to ingenio

            $output[$fieldname] = array('dataIndex' => $fieldname,
                                        'name'      => $fieldname,
                                        'sortable'  => true,
                                        'header'    => $fieldname,
                                        'tooltip'   =>
                                            $fieldname . ' del nomenclador',
                                        'length'    => $length,
                                        'dataType'  => $dataType,
                                        'noNull'    => $column['notnull']);

            // Verificar si la columna es llave ocultarla y marcarla como id
            if ($column['primary']) {
                $output[$fieldname]['identifier'] = true;
                $output[$fieldname]['hidden'] = true;
            }

            // Tomar el segundo campo y
            /*if(  $count == 1 ){
                $output[$fieldname]['denom'] = true;
            }*/

            $column['default'] = isset($column['default']) ? $column['default']
                : 0;  //add by mgleon to ingenio
            // Actualizar cuando es booleano si el tipo es int y los valores por defecto son 0 o 1
            if ($output[$fieldname]['dataType'] == 'int'
                && ($column['default'] == 0 || $column['default'] == 1)
                && $length == 1
                && !$column['primary']
            ) {
                $output[$fieldname]['dataType'] = 'boolean';
            }

            $count++;

        }
        return $output;

    }

    /**
     * @param $agFile
     */
    static public function validateFileUploaded($agFile)
    {
        if ($agFile['error'] == 0) {
            return true;
        }
        switch ($agFile['error']) {
            case UPLOAD_ERR_INI_SIZE : //1
            {
                return 'El tama&ntilde;o del archivo ' . $agFile['name'] . ' excede los l&iacute;mites establecidos en el
               servidor ' . ini_get('upload_max_filesize') . '.';
            }
                break;
            case UPLOAD_ERR_FORM_SIZE : //2
            {
                return 'El tama&ntilde;o del archivo ' . $agFile['name'] . ' excede los l&iacute;mites establecidos para
               los formularios en el servidor.';
            }
                break;
            case UPLOAD_ERR_PARTIAL : //3
            {
                return 'El archivo ' . $agFile['name']
                . ' se subi&oacute; parcialmente al servidor.';
            }
                break;
            case UPLOAD_ERR_NO_FILE  : //4
            {
                return 'No lleg&oacute; ning&uacute;n archivo al servidor.';
            }
                break;
            case UPLOAD_ERR_NO_TMP_DIR   : {
                return 'No existe directorio temporal definido en el servidor.';
            }
                break;
            case UPLOAD_ERR_CANT_WRITE   : {
                return 'No hay espacio en el servidor para subir el archivo '
                . $agFile['name'] . '.';
            }
                break;
            case UPLOAD_ERR_EXTENSION    : {
                return 'El tipo de extensi&oacute;n no es permitida en el servidor.';
            }
            default: {
            return 'Error no identificado en el servidor.';
            }
            break;
        }
        return true;
    }

    public function getIdentifier()
    {
        $table = $this->getTable();
        return $table->getIdentifier();
    }
}
