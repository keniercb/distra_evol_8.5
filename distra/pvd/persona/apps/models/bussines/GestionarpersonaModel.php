<?php

/**
 * Class GestionarpersonaModel
 */
class GestionarpersonaModel extends ZendExt_Model
{
    protected $datProjectConcept;

    function __construct()
    {
        $this->datProjectConcept = new DatProyectoconceptoModel();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getTreeConcept($idproject)
    {
        $arrConcepts = $this->datProjectConcept->getConceptsByProject($idproject);

        return $this->generateTreeConcept($arrConcepts);
    }

    private function generateTreeConcept(array $array, $idPadre)
    {
        $treeFormat = array();
        foreach ($array as $k => $v) {
            $lenght = count($treeFormat);
            if (empty($idPadre)) {
                if ($v['idproyectoconcepto'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = false;
                    $treeFormat[$lenght]['children'] = $this->generateTreeConcept($array, $v['idproyectoconcepto']);
                }
            } else {
                if ($v['idpadre'] == $idPadre && $v['idproyectoconcepto'] != $idPadre) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = false;
                    if ($v['tipo'] >= 1) {
                        $treeFormat[$lenght]['leaf'] = true;
                        if ($v['obligatorio']) {
                            $treeFormat[$lenght]['obligatorio'] = $v['obligatorio'];
                        } else {
                            $treeFormat[$lenght]['obligatorio'] = false;
                            $treeFormat[$lenght]['checked'] = false;
                        }
                    }
                    $treeFormat[$lenght]['children'] = $this->generateTreeConcept($array, $v['idproyectoconcepto']);
                }
            }
        }

        return $treeFormat;
    }

}