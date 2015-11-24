<?php

namespace B2B\BlogBundle\Controller;


use B2B\BlogBundle\Entity\PostMetaRepository;
use B2B\BlogBundle\Entity\CompanyRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Doctrine\ORM\EntityManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
/**
 * @Route("/info/{i}")
 * @Template()
 * 
 */
class InfoController extends Controller{
    function indexAction($i){
          $connect = $this->get('database_connection');
          $connect->executeUpdate('UPDATE `companies` SET `views`=`views`+1 WHERE C='.$i);
          $infos['infol'] = $connect->fetchAll("SELECT * FROM companies where C=".$i);
          $data = [
              'info'=>$infos['infol']
          ];
          return $this->render('B2BBlogBundle:Company:list.html.twig',compact('data'));   
    }
}
class InfoarticleController{
    function indexAction($i){
        $connect = $this->get('database_connection');
        $info['info'] = $connect->fetchAll("SELECT * FROM companies where C=".$i);
        return $this->render('B2BBlogBundle:Company:list.html.twig',$info); 
    }
} 