<?php

namespace B2B\BlogBundle\Controller;

use B2B\BlogBundle\Entity\PostMetaRepository;
use B2B\BlogBundle\Entity\CompanyRepository;
use B2B\BlogBundle\Entity\Companies;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Doctrine\ORM\EntityRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
/**
 * @Route("/company/{i}")
 * @Template()
 * 
 */


class CompanyController extends Controller{

    public function indexAction($i){
 /* $em = $this->getDoctrine()
               ->getEntityManager();
          $company['result'] = $em->getRepository('B2BBlogBundle:Company')
                ->getLatestCompany(1,12);
          $articlesPerPage = 12;
               */ 
                $connect = $this->get('database_connection');
              $rezult = $connect->fetchAll('select * from companies');
                $count = 0;
              foreach($rezult as $item){
                  $count++;
              }
        $nn=$i;
        $nn--;
            $rez= $count/12;
          /*  $company = $this->getDoctrine()
              ->getRepository('B2BBlogBundle:Company');
              $query = $this->getEntityManager()
                ->createQuery('SELECT * From companyy');
              return $querys->mysql_fetch_array($query);
                  */
            $m=$i-1;
            $m=$m*12;if($m>0){
            $m--;}
           /* $em = $this->getDoctrine()
               ->getEntityManager();
          $company['result'] = $em->getRepository('B2BBlogBundle:Company')
                ->getLatestCompany($m,$i*12);*/
            $company['rezult']= $connect->fetchAll('select * from companies  LIMIT 12 OFFSET '.$m);
             $company['respopular'] = $connect->fetchAll('SELECT * FROM companies order by views DESC limit 5');
           /* $em = $this->getDoctrine()->getManager();
            $qb = $em->createQueryBuilder();
            $qb->select('c')
                 ->from('Companies','c')
                   ->setFirstResult( $m )
                   ->setMaxResults( 12 );
            $result = $qb->getQuery();
            $result1 = $result->getResult();*/
           $data = [
               'a'=> $i++,
               'b'=>$nn,
              'company' => $company['rezult'],
              'count' =>  ceil($rez),
              'subjects' => $this->get('post.utility')->subjects(),
              'title' => 'ome',
              'popular' => $company['respopular'],
            
        ];
               return $this->render('B2BBlogBundle:Default:index2.html.twig', compact('data')); 
} 



    }
