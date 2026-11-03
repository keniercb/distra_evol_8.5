<?php

/**
 * @author    Osleidy Quiala Fernández
 * @version   1.0.0
 * @copyright ERP-CUBA
 */
class CmpbasereglamentariaModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function cargarbasereglamentarias($parametros)
    {
      $cadena = " SELECT b.*,
                /*Para que cuando el usuario no tenga persona muestre usuario*/
                CASE WHEN p.idpersona is NULL THEN u.nombreusuario
                ELSE p.nombre || ' ' || p.papel || ' ' || p.sapel END as nombreautor,
  count(b.idbase) over() as totalelementos 
                FROM  mod_objetivos.dat_basereglamentaria b
                
                INNER JOIN mod_seguridad.seg_usuario u
                ON u.idusuario = b.idautor

                LEFT JOIN mod_persona.dat_persona p
                ON u.idpersona = p.idpersona
                
                OFFSET {$parametros->start} LIMIT {$parametros->limit} ";

      $connA = Doctrine_Manager:: connection();
      $res = $connA->execute($cadena);
      $resultado = $res->fetchAll();
      return $resultado;
    }




}


