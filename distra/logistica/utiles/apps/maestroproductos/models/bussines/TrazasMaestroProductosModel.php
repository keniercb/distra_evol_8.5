<?php

class TrazasMaestroProductosModel extends BaseModel
{
    public function __construct($esExterno = false)
    {
        parent::__construct($esExterno);
    }

    public function addTraza($action, $objectId, $userId)
    {
        $sql = "insert into mod_datosmaestros.seg_trazamp(actionid, dato, userid, objectid, fecha) 
        values ({$action},(select concat(d) from mod_datosmaestros.nom_indicador d where d.idindicador ={$objectId}),{$userId},{$objectId},now()::date)";
        $this->doctrineHelper->executeQuery($sql);
    }
}