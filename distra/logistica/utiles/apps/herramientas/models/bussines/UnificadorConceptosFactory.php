<?php


class UnificadorConceptosFactory extends BaseModel
{
    /**
     * @var UnificadorConceptosFactory
     */
    private $model;

    /**
     * @throws Exception
     */
    public function __construct($concepto)
    {
        parent::__construct(true);
        $this->model = $this->getModel($concepto);
    }

    /**
     * @return UnificadorConceptosFactory
     * @throws Exception
     */
    public function getModel($concepto){
        switch ($concepto){
            case  'cliente':
                return new ClientesModel();

            case 'productos' :
                return new ProductosModel();
            default:
                die($concepto);
                throw new Exception('Error');
        }
    }

    public function devolver($params)
    {
        return $this->model->devolver($params);
    }

    public function unificar($pDestino, $pDataUnificar)
    {
        return $this->model->unificar($pDestino, $pDataUnificar);
    }
}