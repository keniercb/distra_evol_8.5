<?php

class DatUsuarioNotificacion extends BaseDatUsuarioNotificacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatNotificacion',
            array('local' => 'idnotificacion', 'foreign' => 'idnotificacion')
        );
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatUsuarioNotificacion')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatUsuarioNotificacion')->limit($limite = 20)
            ->offset($inicio = 0)->execute();
        return $result->toArray();
    }

    public function eliminarUserNotificacion(
        $idusuario, $idusuariorelacionado, $idnotificacion
    ) {
        $query = new Doctrine_Query();
        $result = $query->delete("DatUsuarioNotificacion")
            ->from("DatUsuarioNotificacion dun")
            ->where(
                "(dun.idusuariorelacionado = $idusuario 
                    OR dun.idusuariorelacionado = $idusuariorelacionado) 
                        AND dun.idnotificacion = $idnotificacion"
            )
            ->execute();
        return true;
    }


    public function Insertar($obj)
    {
        $datUsuarioNotificacion = new DatUsuarioNotificacion();
        try {
            $datUsuarioNotificacion->idnotificacion = $obj->idnotificacion;
            $datUsuarioNotificacion->idusuariorelacionado
                = $obj->idusuariorelacionado;
            $datUsuarioNotificacion->save();
            $dh = Doctrine_Manager::getInstance();
            $conn = $dh->getCurrentConnection();
            $conn->commit();
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }


    public function actualizarUserNotificacion(
        $idusuario, $idusuariorelacionado, $idnotificacion
    ) {

      $where=" (dun.idusuariorelacionado = $idusuario ";
      if($idusuariorelacionado!=null){
        $where.=" OR dun.idusuariorelacionado = $idusuariorelacionado ";
      }
      $where.=" ) AND dun.idnotificacion = $idnotificacion ";
        $query = new Doctrine_Query();
        try{
          $result = $query->update("DatUsuarioNotificacion dun")
                          ->set("dun.notificacionleida", 1)
                          ->where(
                            $where
                          )
                          ->execute();
        }catch (Exception $e){
          return false;
        }

        return true;
    }

}
//fin clase 

