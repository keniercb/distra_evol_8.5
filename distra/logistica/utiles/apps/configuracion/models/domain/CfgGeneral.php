<?php

/*
 * @utor: Adrian Fernandez Martinez
 * fech@: 25-01-2013
 */

class CfgGeneral extends BaseCfgGeneral
{

    public function setUp()
    {
        parent::setUp();
    }

    /* public function CargarConfGen($idestructura){
      $query = new Doctrine_Query();
      return $query->select('cfg.idestructura, cfg.idlogo, cfg.idcunno')
      ->from('CfgGeneral cfg')
      ->where('cfg.idestructura = ?', array($idestructura))
      ->fetchArray();
      } */

    /* public function CargarConfiguracionGeneral($idestructura) {

      $query = new Doctrine_Query();
      return $query->select('cfg.idestructura, cfg.idlogo, cfg.idcunno,
      cfg.realordenado, cfg.categoriaproducto, cfg.categoriaproducto') 
     * //cfgsub.idsubsistema
      ->from('CfgGeneral cfg')
      //->leftJoin('cfg.DatConfiguracionsubsitema cfgsub')
      ->where('cfg.idestructura = ?', array($idestructura))
      ->fetchArray();
      } */

    public function SetLogotipoEntidad($idimagen, $idestructura, $logotipo)
    {

        $configuracion = Doctrine::getTable('CfgGeneral')->find($idestructura);

        if (!$configuracion) {
            $configuracion = new CfgGeneral();
            $configuracion->idestructura = $idestructura;
        }

        if ($logotipo == 'logo') {
            $configuracion->idlogo = $idimagen;
        } else {
            $configuracion->idcunno = $idimagen;
        }

        $configuracion->save();
    }

    public function getConfiguracion($idestructura)
    {
        $query = new Doctrine_Query();
        $respuesta = $query->from('CfgGeneral g')
            ->where('g.idestructura = ?', $idestructura)
            ->fetchArray();
        return (count($respuesta) == 0) ? array(0 => array()) : $respuesta;
    }

}
