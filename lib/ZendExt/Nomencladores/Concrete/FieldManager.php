<?php
class ZendExt_Nomencladores_Concrete_FieldManager implements ZendExt_Nomencladores_Interfaces_IField
{
    private $_db;
    private $_sql;

    /**
     * Constructor
     *
     * @return ZendExt_Nom_Concrete_FieldManager
     * */

    public function __construct()
    {
        $this->_db = ZendExt_Nomencladores_Db_Singleton::getInstance();
        $this->_sql = new ZendExt_Nomencladores_Sql_Field();

    }

    /**
     * addField
     *
     * Adiciona un campo
     *
     * @param String $pTable       Nombre de la tabla
     * @param String $pNombreField Nombre del nuevo campo
     * @param String $pType        Tipo de dato del nuevo campo
     * @param String $pPK          Llave primaria
     *
     * @return array
     */
    public function addField($pTable, $pNombreField, $pType, $pPK, $pSchema)
    {
        $this->_db->query(
            $this->insertFieldsOnCatalog($pTable, $pNombreField, $pType, $pPK),
            $this->_db->getConnBySchema('mod_datosmaestros')
        );

        return $this->_db->query(
                        $this->_sql->addField($pSchema . "." . $pTable, $pNombreField, $pType, $pPK), $this->_db->getConnBySchema('mod_datosmaestros')
        );
    }

    /**
     * addFK
     *
     * Adiciona una Llave Foranea
     *
     * @param String $pTable        Nombre de la tabla
     * @param String $pForeignTable Nombre de la tabla
     * @param String $pForeignField Nombre del campo destino
     *
     * @return array
     */
    public function addFK($pTable, $pForeignTable, $pLocalField, $pForeignField, $pSchema)
    {
        return $this->_db->query(
            $this->_sql->addFK($pTable, $pForeignTable, $pLocalField, $pForeignField),
            $this->_db->getConnBySchema($pSchema)
        );
    }

    /**
     * dropField
     *
     * Elimina un campo
     *
     * @param String $pTable Nombre de la tabla
     * @param String $pField Nombre del campo a eliminar
     *
     * @return array
     */
    public function dropField($pTable, $pField)
    {
        $pTable1 = substr($pTable, strrpos($pTable, '.') + 1, strlen($pTable) - strrpos($pTable, '.') - 1);
        $this->_db->query($this->deleteFieldsOnCatalog($pTable1, $pField), $pTable1);
        return $this->_db->query($this->_sql->dropField($pTable, $pField), $pTable1);
    }

    /**
     * dropFK
     *
     * elimina una restriccion
     *
     * @param String $pTable        Nombre de la tabla
     * @param String $pForeignTable Nombre de la tabla foranea
     * @param String $pForeignField Nombre del campo foraneo
     *
     * @return array
     */
    public function dropFK($pTable, $pForeignField)
    {
        return $this->_db->query($this->_sql->dropFK($pTable, $pForeignField), $pTable);
    }

    /**
     * renameField
     *
     * Renombra un campo
     *
     * @param String $pTable   Nombre de la tabla
     * @param String $pOldName Nombre antiguo del campo
     * @param String $pNewName Nombre nuevo del campo
     *
     * @return array
     */
    public function renameField($pTable, $pOldName, $pNewName)
    {
        $pTable1 = substr($pTable, strrpos($pTable, '.') + 1, strlen($pTable) - strrpos($pTable, '.') - 1);
        //die($this->_sql->renameField ( $pTable, $pOldName, $pNewName ));
        $this->_db->query($this->updateFieldsNameCatalog($pTable1, $pNewName, $pOldName), $pTable1);
        return $this->_db->query($this->_sql->renameField($pTable, $pOldName, $pNewName), $pTable1);
    }

    public function insertFieldsOnCatalog($pTable, $pField, $pType, $pPK)
    {
        return "insert into campos (tablasnombre,field,type,pk) values ('$pTable', '$pField', '$pType', '$pPK')";
    }

    private function updateFieldsOnCatalog($pTable, $pField, $pType, $pPK)
    {
        return "update campos set type = '$pType', pk = '$pPK' where tablasnombre = '$pTable' and field = '$pField'";
    }

    private function deleteFieldsOnCatalog($pTable, $pField)
    {
        return "delete from campos where tablasnombre = '$pTable' and field = '$pField'";
    }

    private function updateFieldsNameCatalog($pTable, $newName, $oldName)
    {
        return "update campos set field = '$newName' where field = '$oldName' and tablasnombre='$pTable'";
    }

    public function getFieldsDetails($pSchema, $pTable)
    {

        /*echo $this->_sql->getFields ( $pTable, $pWhere );
        die ();*/
        $result = $this->_db->queryfield(
            $this->_sql->getFields($pSchema, $pTable), $this->_db->getConnBySchema($pSchema)
        );
        return $result;
    }

    public function addPresentacion(
    $pLongitud, $pNombre, $pRegEx, $pDesc, $pVisible, $pComponent, $pDisplayField, $pForeignTable, $pIdField
    )
    {


        return $this->_db->query(
            $this->_sql->addPresentacion(
                $pLongitud, $pRegEx, $pDesc, $pVisible, $pNombre, $pComponent, $pDisplayField, $pForeignTable, $pIdField
            ), $this->_db->getConnBySchema('mod_datosmaestros')
        );
    }

    public function addUnique($pTable, $pField)
    {
        return $this->_db->query($this->_sql->addUnique($pTable, $pField), $pTable);
    }

    public function addExtFK($pextTable, $pNomenclador, $pextField, $pField)
    {
        //die($this->_sql->addExtFK($pextTable,$pNomenclador,$pextField,$pField));
        return $this->_db->query($this->_sql->addExtFK($pextTable, $pNomenclador, $pextField, $pField), $pextTable);
    }

    public function getLlaveForaneaDadoTablaCampo($pTabla, $pCampo)
    {
        return $this->_db->query($this->_sql->getLlaveForaneaDadoTablaCampo($pTabla, $pCampo), $pTabla);
    }

    public function setNextValue()
    {
        return $this->_db->query($this->_sql->setNextValue());
    }

    public function getLastValue()
    {
        return $this->_db->query($this->_sql->getLastValue(), $this->_db->getConnBySchema('mod_datosmaestros'));
    }

    public function getRegExps()
    {
        return $this->_db->query($this->_sql->getRegExps(), $this->_db->getConnBySchema('mod_datosmaestros'));
    }

    public function getTiposDatos()
    {
        return $this->_db->query($this->_sql->getTiposDatos(), $this->_db->getConnBySchema('mod_datosmaestros'));
    }

    public function getTiposComponentes()
    {
        return $this->_db->query($this->_sql->getTiposComponentes(), $this->_db->getConnBySchema('mod_datosmaestros'));
    }

    function addExt2FK($pextTable, $pNomenclador, $pextField, $pField)
    {
        return $this->_db->query(
            $this->_sql->addExt2FK($pextTable, $pNomenclador, $pextField, $pField),
            $this->_db->getConnBySchema('mod_datosmaestros')
        );
    }

    function getFieldData($pIdField)
    {
        return $this->_db->query(
            $this->_sql->getFieldData($pIdField), $this->_db->getConnBySchema('mod_datosmaestros')
        );
    }

    public function getPKFields($pTable, $pSchema)
    {
        return $this->_db->query($this->_sql->getPKFields($pTable,$pSchema), $this->_db->getConnBySchema($pSchema));
    }

    public function getNonPKFields($pTable, $pSchema)
    {
        return $this->_db->query($this->_sql->getNonPKFields($pTable, $pSchema), $this->_db->getConnBySchema($pSchema));
    }

    public function getPresentacion($pIdPresentacion)
    {
        return $this->_db->query(
            $this->_sql->getPresentacion($pIdPresentacion), $this->_db->getConnBySchema('mod_datosmaestros')
        );
    }
}
