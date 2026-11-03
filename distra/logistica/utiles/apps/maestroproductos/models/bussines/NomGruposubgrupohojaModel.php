<?php

/**
 * NomGruposubgrupoModel
 * Modelo del Nomenclador de SubGrupos
 *
 * @package    Activos Fijos Tangibles
 * @subpackage Nomencladores
 * @author     Jorge Luis Cuellar Mondeja
 * @version    2.0
 */
class NomGruposubgrupohojaModel extends ZendExt_Model
{
    private $tablaModel;

    public function setUp()
    {
        $this->tablaModel = new ZendExt_Metadata_Models_TablaModel();
        parent:: ZendExt_Model();
    }

    public function insertar($parametros)
    {

        $objSubGrupo = new NomGruposubgrupo();
        $objSubGrupo->synchronizeWithArray($parametros);
        $objSubGrupo->idpadre = $parametros['idpadre'];
        $objSubGrupo->NomGruposubgrupohoja->synchronizeWithArray($parametros);
        $objSubGrupo->save();
    }

    public function actualizar($parametros)
    {
        if ($parametros['idpadre'] == 0) {
            if ($parametros['idformato'] == 0) {
                $consulta = new Doctrine_Query();
                $prueba = $consulta->from('NomGruposubgrupo')->where(
                    'idgruposubgrupo = ?', array($parametros['idgrupo'])
                )->fetchArray();
                $parametros['idpadre'] = $prueba[0]['idpadre'];
                $parametros['idformato'] = $prueba[0]['idformato'];
            }
        }
        $objSubGrupo = Doctrine:: getTable('NomGruposubgrupo')->find($parametros['idgrupo']);
        unset($parametros['version']);
        $objSubGrupo->synchronizeWithArray($parametros);
        $objSubGrupo->NomGruposubgrupohoja->synchronizeWithArray($parametros);
        $objSubGrupo->save();
    }

    public function eliminar($arrGrupos)
    {
        foreach ($arrGrupos as $idgrupo) {
            $objSubGrupo = Doctrine:: getTable('NomGruposubgrupo')->find($idgrupo);
            if ($objSubGrupo->idtabla > 0) {
                $this->tablaModel->eliminarTabla($objSubGrupo->idtabla);
            }
            if ($objSubGrupo->idtablageneral > 1) {
                $this->tablaModel->eliminarTabla($objSubGrupo->idtablageneral);
            }

            $objSubGrupo->delete();
        }
    }

}
