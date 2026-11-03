<?php
class ZendExt_Nomencladores_Concrete_TableManager implements ZendExt_Nomencladores_Interfaces_ITabla
{
    private $_db;
    private $_sql;
    private $_sqlt;

    public function __construct()
    {
        $this->_db = ZendExt_Nomencladores_Db_Singleton::getInstance();
        $this->_sql = new ZendExt_Nomencladores_Sql_Table();
        $this->_sqlt = new ZendExt_Nomencladores_Sql_Tree();
    }

    public function createTable($pSchema, $pTable, $pTree, $pEnabled, $pCategory)
    {
        $this->insertTableOnCatalog('nom_' . $pTable, $pTree, $pEnabled, $pSchema);
        $this->_db->query($this->_sql->createTable($pSchema . '.nom_' . $pTable), $pSchema);
        $cat = new ZendExt_Nomencladores_Concrete_CategoryManager();

        $f = new ZendExt_Nomencladores_Concrete_FieldManager();

        $f->addField('nom_' . $pTable, "id$pTable", "numeric (19)", 'true', $pSchema);
        $id = $f->getLastValue();
        $id = $id[0]['last_value'];
        $f->addPresentacion('12', "id$pTable", '1', 'Identificador del Concepto', 'false', '3', '', '', $id);
        foreach ($pCategory as $c) {
            $cat->setCategoryToTable("nom_$pTable", $c);
        }

        if ($pTree == 'true') {
            $this->createTree("nom_$pTable", $pSchema);
            $this->triggerInsert($pTable, $pSchema);
        }
    }

    public function manageRegisters($pSchema, $pTable, $pCategory, $pAction)
    {
        $cat = new ZendExt_Nomencladores_Concrete_CategoryManager();
        $haveThisCategory = $cat->haveThisCategory($pTable, $pCategory);
        if (!$haveThisCategory) {
            if ($pAction == 'reg') {
                $cat->setCategoryToTable($pSchema, $pTable, $pCategory);
            } elseif ($pAction == 'unreg') {
                $cat->dropCategoryToTable($pSchema, $pTable, $pCategory);
            }
        }
    }

    private function insertTableOnCatalog($pSchema, $pTable, $pTree, $pEnabled)
    {
        $pNativo = 'true';
        if ($pSchema != 'mod_datosmaestros') {
            $pNativo = 'false';
        }
        //die($this->_sql->insertTableOnCatalog ( $pTable, $pTree, $pEnabled, $pNativo, $pSchema ));
        $this->_db->query(
            $this->_sql->insertTableOnCatalog($pSchema, $pTable, $pTree, $pEnabled, $pNativo), 'mod_datosmaestros'
        );
    }

    public function dropTable($pTable)
    {
        $pSchema = $this->_db->getSchemaByTable($pTable);

        $this->_db->query($this->_sql->dropTable($pSchema . "." . $pTable), $pSchema);
        $this->deleteTableOnCatalog($pTable);
    }

    private function deleteTableOnCatalog($pTable)
    {
        $query = $this->_sql->deleteTableOnCatalog($pTable);
        foreach ($query as $querys) {
            $this->_db->query($querys, $pTable);
        }
    }

    public function tableExist($pSchema, $pNom)
    {
        $result = $this->_db->query($this->_sql->tableExist($pSchema, $pNom), $this->_db->getConnBySchema($pSchema));
        return $result;
    }

    public function fieldExist($pSchema, $pTable, $pField)
    {
        //echo $this->_sql->tableExist ( $pNom ); die;

        $result = $this->_db->query(
            $this->_sql->fieldExist($pSchema, $pTable, $pField), $this->_db->getConnBySchema($pSchema)
        );

        //echo '<pre>'; print_r($result); die;

        return $result;
    }

    public function getOneElement($pSchema, $pTable, $pkey, $pSelectParams)
    {
        $array = $this->_db->query(
            $this->_sql->getOneElement($pTable, $pkey, $pSelectParams), $this->_db->getConnBySchema($pSchema)
        );
        return $array[0];
    }

    public function selectElements($pSchema, $pTable, $pLimit, $pOffset, $pWhere, $pOrderBy)
    {
        return $this->_db->query(
            $this->_sql->select($pTable, $pLimit, $pOffset, $pWhere, $pOrderBy), $this->_db->getConnBySchema($pSchema)
        ); //substr ($pTable, 0, strpos ($pTable, '.')));
    }


    public function hasRelatedElements($pSchema, $pTable)
    {
        $result = $this->_db->query($this->_sql->hasRelatedElements($pSchema, $pTable), $pSchema);

        //echo '<pre>'; print_r($result); die;

        return count($result) > 0;
    }


    public function getRelationFields($pSchema, $pTable)
    {
        $result = $this->_db->query($this->_sql->getRelationFields($pSchema, $pTable), $pSchema);

        return $result;
    }

    public function getRelatedElements($pTable, $pLimit, $pOffset)
    {
        $tmp = $this->tableExist($pTable);

        $relationFields = $this->getRelationFields($tmp [0]['esquema'], $pTable);
        $innerPart = '';

        $selectPart = '';
        $innerPart = '';

        foreach ($relationFields as $var) {
            $selectPart .= $var ['tablaf'] . '.' . $var ['combdisplay'];
            $idfield = str_replace('nom_', 'id', $var ['tablaf']);
            $innerPart .= 'inner join ' . $var ['tablaf'] . ' on ' . $var ['tablaf'] . '.' . $idfield
                . " = $pTable." . $var ['field'];
        }

        $finalQuery = "select $selectPart, $pTable.*
						from $pTable
                $innerPart";

        $finalQuery = ($pLimit == 0) ? $finalQuery
            : $finalQuery . " limit = $pLimit";

        $finalQuery = ($pOffset == 0) ? $finalQuery
            : $finalQuery . " offset = $pOffset";

        return $this->_db->query($finalQuery, $tmp [0]['esquema']);
    }

    public function getTree($pSchema, $pTable, $pIdElement, $pIdExtComun)
    {
        //print_r($pIdElement); die;

        $arr = $this->getOneElement($pSchema, $pTable, $pIdElement, $pIdExtComun);

        $pTable1 = substr($pTable, strrpos($pTable, '.') + 1, strlen($pTable) - strrpos($pTable, '.') - 1);

        $pTable2 = substr($pTable1, strrpos($pTable1, '_') + 1, strlen($pTable1) - strrpos($pTable1, '_') - 1);
        $keys = array_keys($arr);
        $values = array();
        foreach ($keys as $llave) {
            if ($llave != 'id' . $pTable2 && $llave != 'idpadre' && $llave != 'ordender' && $llave != 'ordenizq') {
                $values[$llave] = $arr[$llave];
            }
        }
        return new ZendExt_Nomencladores_ADTTree(
            $arr['id'. $pTable2], $pTable1, $pSchema, $arr['ordenizq'], 
            $arr['ordender'], $arr['idpadre'], $values, $pIdExtComun
        );
    }

    public function updateElements($pSchema, $pTable, $pValues, $pPKs)
    {
        //$pSchema = substr ($pTable, 0, strpos ($pTable, '.'));
        return $this->_db->query($this->_sql->update($pTable, $pValues, $pPKs), $pSchema);
    }

    public function deleteElements($pSchema, $pTable, $pKey)
    {
        //$pSchema = substr ($pTable, 0, strpos ($pTable, '.'));

        return $this->_db->query($this->_sql->delete($pTable, $pKey), $pSchema);
    }

    public function insertElements($pSchema, $pTable, $pValues)
    {
        $pSchema = substr($pTable, 0, strpos($pTable, '.'));
        try {
            return $this->_db->query($this->_sql->insert($pTable, $pValues), $pSchema);
        } catch (ZendExt_Exception $e) {
            if ($e->getIdException() == 'NOM002') {
                throw new ZendExt_Exception('NOM006', $e);
            } else {
                throw  $e;
            }
        }
    }

    public function getTables($pSchema, $pLimit, $pOffset, $pNoms)
    {
        return $this->_db->query(
            $this->_sql->getTables($pLimit, $pOffset, $pSchema, $pNoms), $this->_db->getConnBySchema($pSchema)
        );
    }

    public function countFields($pSchema, $pTable)
    {
        $arr = $this->_db->query($this->_sql->countFields($pTable), $this->_db->getConnBySchema($pSchema));
        return $arr[0]['count'];
    }

    public function countTables($pSchema, $pNoms)
    {
        $arr = $this->_db->query($this->_sql->countTables($pSchema, $pNoms), $this->_db->getConnBySchema($pSchema));
        return $arr[0]['count'];
    }

    public function countValues($pSchema, $pTable, $pWhere)
    {
        $arr = $this->_db->query($this->_sql->countValues($pTable, $pWhere), $this->_db->getConnBySchema($pSchema));
        return $arr[0]['count'];
    }

    public function IsTree($pSchema, $pTable)
    {
        if ($this->_db->query(
            $this->_sql->fieldExist($pSchema, $pTable, 'ordenizq'), $this->_db->getConnBySchema($pSchema)
        )
        ) {
//if($this->_db->query( $this->_sql->fieldExist($pSchema,$pTable,'idpadre' ), $this->_db->getConnBySchema( $pSchema )))
            if ($this->_db->query(
                $this->_sql->fieldExist($pSchema, $pTable, 'ordender'), $this->_db->getConnBySchema($pSchema)
            )
            ) {
                return true;
            } else {
                return false;
            }
        }
    }

    private function createTree($pSchema, $pTable)
    {
        $f = new ZendExt_Nomencladores_Concrete_FieldManager();
        $f->addField($pTable, "idpadre", "numeric (19)", 'false', $pSchema);
        $id = $f->getLastValue();

        $id = $id[0]['last_value'];

        $tmp = str_replace('nom_', 'id', $pTable);

        $f->addPresentacion('19', 'idpadre', '2', 'Id del Padre', 'false', '1', "$tmp", "$pTable", $id);
        $f->addField($pTable, "ordenizq", "numeric (19)", 'false', $pSchema);
        $id = $f->getLastValue();
        $id = $id[0]['last_value'];

        $f->addPresentacion('19', 'ordenizq', '1', 'Hijos izquierdos', 'false', '1', '', '', $id);
        $f->addField($pTable, "ordender", "numeric (19)", 'false', $pSchema);
        $id = $f->getLastValue();

        $id = $id[0]['last_value'];
        $f->addPresentacion('19', 'ordender', '1', 'Hijos derechos', 'false', '3', '', '', $id);

        $pTable2 = substr($pTable, strrpos($pTable, '_') + 1, strlen($pTable) - strrpos($pTable, '_') - 1);
        $f->addFK($pSchema . "." . $pTable, $pSchema . "." . $pTable, "idpadre", "id$pTable2", $pSchema);
    }

    private function triggerInsert($pSchema, $pTable)
    {
        $this->_db->holeQuery($this->_sql->triggerInsert($pTable, $pSchema), $this->_db->getConnBySchema($pSchema));
    }

    public function addSecuencia($pSchema, $pTable, $pPK)
    {
        //echo $this->_sql->addSecuencia($pTable,$pPK,$pEsquema); die;
        $this->_db->query($this->_sql->addSecuencia($pTable, $pPK, $pSchema), $this->_db->getConnBySchema($pSchema));
    }

    public function insertSecuencia($pValues)
    {
        $this->insertElement('nom_secuenciasnomencladores', $pValues);
    }

    public function addExtNom($pSchema, $pTable, $pCategory)
    {
        $sql = $this->_sql->addExtNom($pTable, $pSchema);
        $arr = $this->_db->query($sql[0]);
        if ($arr[0]['table_name'] == $pTable) {
            $arr = $this->_db->query($sql[1], $pSchema);
            $tree = $this->checkTree($arr);
            $this->insertTableOnCatalog($pTable, $tree, 'true', $pSchema);
            $cat = new ZendExt_Nomencladores_Concrete_CategoryManager();
            foreach ($pCategory as $c) {
                $cat->setCategoryToTable($pTable, $c);
            }
            $f = new ZendExt_Nomencladores_Concrete_FieldManager();
            $pTable2 = substr($pTable, strrpos($pTable, '_') + 1, strlen($pTable) - strrpos($pTable, '_') - 1);
            foreach ($arr as $field) {
                $pri = 'false';
                if ($field['column_name'] == "id$pTable2") {
                    $pri = 'true';
                }
                $this->_db->query($f->insertFieldsOnCatalog($pTable, $field['column_name'], $field['data_type'], $pri));
            }
        } else {
            echo 'el nomenclador no existe';
        }
    }

    public function selectParam($pSchema, $pTable, $pFields, $pLimit, $pOffset, $pWhere, $pOrderBy)
    {
        //$pSchema = substr ($pTable, 0, strpos ($pTable, '.'));

        return $this->_db->query(
            $this->_sql->selectParam($pTable, $pFields, $pLimit, $pOffset, $pWhere, $pOrderBy), $pSchema
        );
    }

    private function checkTree($pFields)
    {
        $p = 0;
        foreach ($pFields as $field) {
            $name = $field['column_name'];
            if ( /*$name == 'idpadre' ||*/
                $name == 'ordenizq' || $name == 'ordender'
            ) {
                $p++;
            }
        }
        if ($p == 3) {
            return 'true';
        }
        return 'false';
    }

    public function getSchemas()
    {
        return $this->_db->getSchemas();
    }

    public function getParent($pTable, $pId)
    {
        return $this->_db->query($this->_sql->getParent($pTable, $pId), $pTable);

    }

    public function getForest($pTable, $pIdExtComun, $pSchema)
    {
        //echo $this->_sql->getForest ($pTable, $pIdExtComun); die;

        $forest = $this->_db->query($this->_sql->getForest($pTable, $pIdExtComun), $pSchema);

        $values = array();
        $campoid = str_replace('nom_', 'id', $pTable);

        foreach ($forest as $var) {
            $limpio = array_slice($var, 2);
            $result
                = new ZendExt_Nomencladores_ADTTree(
                    $var [$campoid], $pTable, $pSchema, $var ['ordender'], 
                    $var ['ordenizq'], $var ['idpadre'], $limpio, $pIdExtComun
                );
            $values [] = $result;
        }

        return $values;
    }

    private function findByLike($pTree, $pLikeParams, $pWhereParams, $pSelectParams, $pSchema)
    {
        //echo $this->_sql->findByLike ($pTree, $pLikeParams, $pWhereParams); die;

        return $this->_db->query(
            $this->_sql->findByLike($pTree, $pLikeParams, $pWhereParams, $pSelectParams), $pSchema
        );
    }

    private function getFromRoot($pElement, $pTree, $pSelectParams)
    {
        $id = str_replace('nom_', 'id', $pTree);

        $parent ['idpadre'] = -1;
        $parent [$id] = 0;

        //echo '<pre>'; print_r ($pSelectParams); die;

        while ($parent ['idpadre'] != $parent [$id]) {
            $parent = $this->getOneElement($pTree, $pElement ['idpadre'], $pSelectParams);
            $parent['children'] [] = $pElement;
            $pElement = $parent;
        }

        return $parent;
    }

    public function getFullTree($pTree, $pLikeParams, $pWhereParams, $pSelectParams)
    {
        $elements = $this->findByLike($pTree, $pLikeParams, $pWhereParams, $pSelectParams);
        $result = array();

        //echo '<pre>'; print_r ($pSelectParams); die;

        foreach ($elements as $var) {
            $t = $this->getFromRoot($var, $pTree, $pSelectParams);
            $result [] = $t;
        }

        //echo '<pre>'; print_r ($result [0]); die;

        return $result;
    }

    public function isForeignKey($pSchema, $pTable, $pField)
    {
        return $this->_db->query(
            $this->_sql->isForeignKey($pSchema, $pTable, $pField), $this->_db->getConnBySchema($pSchema)
        );
    }

    public function getForeignDatils($pSchema, $pforeignField)
    {
        return $this->_db->query($this->_sql->getForeignDatils($pforeignField), $this->_db->getConnBySchema($pSchema));
    }
}
