<?php 
class SegUsuariocompartimentacionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCompartimentacionesByUser($idusuario)
    {
        return SegUsuariocompartimentacion::getCompartimentacionesByUser($idusuario);
    }

    public function add($idusuario, $idcompartimentacion, $pordefecto)
    {
        try {
            $conn = Zend_Registry::get('conexion');
            $arrids = implode(",",$idcompartimentacion);
            // Agrega las nuevas relaciones 
            foreach ($idcompartimentacion as $c) {
                $query = "SELECT 
                            idusuariocompartimentacion,
                            idusuario,
                            idcompartimentacion,
                            pordefecto
                            FROM 
                            mod_rrhhmaestro.seg_usuariocompartimentacion 
                            where idusuario = {$idusuario} and idcompartimentacion = {$c}";
                    $result= $conn->fetchAll($query);
                    if (count($result) == 0) {
                         
                            $obj = new SegUsuariocompartimentacion();
                            $obj->idusuario = $idusuario;
                            $obj->idcompartimentacion = $c;
                            $obj->pordefecto = $pordefecto;
                            $obj->save();
                     }

            }
            // Elimina las nuevas relaciones que no estan 
                        $querydelete = "DELETE FROM 
                                    mod_rrhhmaestro.seg_usuariocompartimentacion 
                                    WHERE 
                                    idcompartimentacion not in ({$arrids})
                                    and idusuario = {$idusuario}
                                    ;";
                        $result2= $conn->fetchAll($querydelete);
                        return true;
                 
        } catch(Exception $e) {
            return false;
         }
    }
}
