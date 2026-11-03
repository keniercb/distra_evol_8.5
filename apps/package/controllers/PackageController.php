<?php

class PackageController extends ZendExt_Controller_Secure
{


    private $_repoModel;

    function init()
    {
        parent::init();
        $this->_repoModel = new RepositoryModel();
    }

    public function packageAction()
    {
        $this->render();
    }

    public function isAuthenticateAction()
    {
        $idPhather = $this->getRequest()->getParams('idpadre');
        echo json_encode($this->_repoModel->isAuthenticate($idPhather));
    }

    public function authenticateCorrectAction()
    {
        $arrays = $this->getRequest()->getParams();
        $result = $this->_repoModel->authenticateCorrect($arrays);
        echo json_encode($result);
    }

    public function getListPackagesAction()
    {
        $filtro = $this->getRequest()->getParam('filtro');
        $packages = array();
        if (isset($filtro) && $filtro !== false) {
            $packages = $this->_repoModel->getPackagesRepositories($filtro);
        } else {
            $packages = $this->_repoModel->getPackagesRepositories();
        }
        echo json_encode($packages);
    }

    public function pushRepositoriesAction()
    {

        echo json_encode(
            $this->_repoModel->pushRepositories($this->getRequest()->getParams())
        );
    }

    public function modifyRepositoryAction()
    {
        echo json_encode(
            $this->_repoModel->modifyRepository($this->getRequest()->getParams())
        );
    }

    public function deleteRepositoryAction()
    {
        echo json_encode(
            $this->_repoModel->deleteRepository($this->getRequest()->getParams())
        );
    }

    public function deletePackageRepositoryAction()
    {
        echo json_encode(
            $this->_repoModel->deletePackageRepository(
                $this->getRequest()->getParams()
            )
        );
    }

    public function getRepositoriesAction()
    {
        echo json_encode($this->_repoModel->getRepositories());
    }

    public function getTagsRepositoriesAction()
    {
        $arraysParameters = $this->getRequest()->getParams();
        echo json_encode(
            $this->_repoModel->getTagsRepositories($arraysParameters)
        );
    }

    public function getRequireIsNotPackagesAction()
    {
        $arraysParameters = $this->getRequest()->getParams();
        $variable = $this->_repoModel->getRequireIsNotPackages(
            $arraysParameters
        );
        if (is_array($variable)) {
            echo json_encode($variable);

            return;
        }
        echo json_encode(
            array(
                'success' => false
            )
        );
    }

    public function involvePackageAction()
    {
        $arraysParameters = $this->getRequest()->getParams();
        echo json_encode($this->_repoModel->involvePackage($arraysParameters));
    }

    public function releasePackagesAction()
    {
        $arraysParameters = $this->getRequest()->getParams();
        echo json_encode($this->_repoModel->releasePackages($arraysParameters));
    }

    public function configurarGestorAction(){
        $result = $this->_repoModel->configurarGestor();
        if($result){
            echo json_encode(
                array(
                    'success' => true,
                    'message' => 'La configuración se ha realizado satisfactoriamente.'
                )
            );
        } else{
            echo json_encode(
                array(
                    'success' => false,
                    'message' => 'Existen problemas para realizar la configuración.'
                )
            );
        }
    }


}



